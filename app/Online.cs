using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Reef.Engine;

namespace Reef;

/// <summary>
/// Everything the app does online, in one place: the check-in with reef.technology83.com (latest version,
/// the developer's note, and usage figures when the user shares them) and the self-update.
/// Nothing here ever blocks the reef or the settings window; every failure is silent.
/// </summary>
public static class Online
{
	public const string DefaultService = "https://reef.technology83.com";

	private static string Service => (Environment.GetEnvironmentVariable("REEF_SERVICE") ?? DefaultService).TrimEnd('/');

	/// <summary>REEF_OFFLINE=1 switches every online feature off (used by the test scripts).</summary>
	private static bool Offline => Environment.GetEnvironmentVariable("REEF_OFFLINE") == "1";

	public static string Version
	{
		get
		{
			Version v = typeof(Online).Assembly.GetName().Version ?? new Version(0, 0, 0);
			return $"{v.Major}.{v.Minor}.{Math.Max(0, v.Build)}";
		}
	}

	/// <summary>What the last check-in told us; kept on disk so the note and update notice show at once next time.</summary>
	public sealed class State
	{
		public string LatestVersion { get; set; } = "";
		public string Url { get; set; } = "";
		public string Sha256 { get; set; } = "";
		public long Size { get; set; }
		public string ReleaseNotes { get; set; } = "";
		public string Note { get; set; } = "";
		public string NoteUpdated { get; set; } = "";
		public DateTime LastCheck { get; set; }
		public System.Collections.Generic.Dictionary<string, DateTime> LastByMode { get; set; } = new();
	}

	private static readonly object _lock = new();
	private static State? _state;
	private static System.Threading.Timer? _daily;
	private static readonly DateTime _started = DateTime.UtcNow;

	private static string StatePath => Path.Combine(ReefSettings.Folder, "online.json");

	public static State Current
	{
		get
		{
			lock (_lock)
			{
				if (_state != null) return _state;
				try { _state = JsonSerializer.Deserialize<State>(File.ReadAllText(StatePath)); } catch { }
				return _state ??= new State();
			}
		}
	}

	/// <summary>Raised (on a background thread) when a check-in brought a new note or version.</summary>
	public static event Action? Changed;

	public static bool UpdateAvailable
	{
		get
		{
			State s = Current;
			return System.Version.TryParse(s.LatestVersion, out Version? latest) && System.Version.TryParse(Version, out Version? mine)
				&& latest > mine && s.Url.StartsWith(Service + "/", StringComparison.OrdinalIgnoreCase) && s.Sha256.Length == 64;
		}
	}

	private static HttpClient Client()
	{
		var c = new HttpClient { Timeout = TimeSpan.FromSeconds(12) };
		c.DefaultRequestHeaders.UserAgent.ParseAdd("ReefAquarium/" + Version);
		return c;
	}

	/// <summary>The random number that stands for this install. It exists only while usage sharing is on.</summary>
	private static string? InstallId(bool share)
	{
		string path = Path.Combine(ReefSettings.Folder, "install.id");
		try
		{
			if (!share)
			{
				if (File.Exists(path)) File.Delete(path);
				return null;
			}
			if (File.Exists(path))
			{
				string id = File.ReadAllText(path).Trim();
				if (id.Length == 32) return id;
			}
			string fresh = Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant();
			Directory.CreateDirectory(ReefSettings.Folder);
			File.WriteAllText(path, fresh);
			return fresh;
		}
		catch { return null; }
	}

	/// <summary>
	/// Tell the service this version is in use and fetch the latest version and note. mode is "settings",
	/// "screensaver" or "wallpaper". Screensaver and wallpaper check in at most once a day; settings always does.
	/// </summary>
	public static void CheckIn(string mode, ReefSettings s, string? gpu = null, bool force = false)
	{
		if (Offline) return;
		State st = Current;
		lock (_lock)
		{
			if (!force && st.LastByMode.TryGetValue(mode, out DateTime last) && DateTime.UtcNow - last < TimeSpan.FromHours(20)) return;
			st.LastByMode[mode] = DateTime.UtcNow;
		}
		// a wallpaper can run for weeks: check again once a day while this process lives
		_daily ??= new System.Threading.Timer(_ => CheckIn(mode, ReefSettings.Load(), gpu, force: true), null, TimeSpan.FromHours(24), TimeSpan.FromHours(24));
		Task.Run(() => Exchange(mode, s, gpu));
	}

	/// <summary>One check-in with the service; never throws.</summary>
	public static async Task Exchange(string mode, ReefSettings s, string? gpu = null)
	{
		State st = Current;
		{
			try
			{
				object body;
				string? id = InstallId(s.ShareUsage);
				if (id == null)
				{
					// usage sharing is off: only the version goes out, which the update check needs anyway
					body = new { v = Version };
				}
				else
				{
					var mons = Monitors.Enumerate();
					TextSettings t = s.Text;
					body = new
					{
						v = Version,
						id,
						mode,
						os = Environment.OSVersion.Version.ToString(),
						gpu = gpu ?? "",
						screens = string.Join(",", mons.Take(8).Select(m => $"{m.Bounds.Width}x{m.Bounds.Height}")),
						use = new
						{
							q = s.QualityLevel,
							res = (int)MathF.Round(s.RenderScale * 100),
							adaptive = s.AdaptiveResolution,
							fps = s.FpsCap,
							wfps = s.WallpaperFps,
							fish = MathF.Round(s.FishDensity, 1),
							coral = MathF.Round(s.CoralDensity, 1),
							shadow = s.ShadowResolution,
							aa = s.Antialiasing,
							drift = s.CameraDrift,
							stats = s.ShowStats,
							time = s.Time.ToString(),
							sound = s.Sound,
							myfish = s.MyFish.Count,
							text = (t.Message ?? "").Trim().Length > 0,
							textStyles = (t.Floating ? "f" : "") + (t.Glass ? "g" : "") + (t.FishSchool ? "s" : "") + (t.Bubbles ? "b" : "") + (t.Sand ? "d" : "") + (t.Marquee ? "m" : ""),
							clock = t.Clock,
							screensUsed = s.Screens.Count == 0 ? mons.Count : s.Screens.Count,
							screensTotal = mons.Count,
							saver = Installer.IsInstalled(),
							autostart = s.WallpaperStartWithWindows,
							gpuChoice = s.GpuChoice,
						},
					};
				}
				using HttpClient c = Client();
				using var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
				using HttpResponseMessage r = await c.PostAsync(Service + "/api/hello", content);
				if (!r.IsSuccessStatusCode) return;
				using JsonDocument doc = JsonDocument.Parse(await r.Content.ReadAsStringAsync());
				bool changed;
				lock (_lock)
				{
					string before = st.LatestVersion + "|" + st.Note;
					if (doc.RootElement.TryGetProperty("latest", out JsonElement l) && l.ValueKind == JsonValueKind.Object)
					{
						st.LatestVersion = Str(l, "version");
						st.Url = Str(l, "url");
						st.Sha256 = Str(l, "sha256").ToLowerInvariant();
						st.Size = l.TryGetProperty("size", out JsonElement sz) && sz.TryGetInt64(out long n) ? n : 0;
						st.ReleaseNotes = Str(l, "notes");
					}
					if (doc.RootElement.TryGetProperty("note", out JsonElement nt) && nt.ValueKind == JsonValueKind.Object)
					{
						st.Note = Str(nt, "text");
						st.NoteUpdated = Str(nt, "updated");
					}
					st.LastCheck = DateTime.UtcNow;
					changed = before != st.LatestVersion + "|" + st.Note;
					try
					{
						Directory.CreateDirectory(ReefSettings.Folder);
						File.WriteAllText(StatePath, JsonSerializer.Serialize(st));
					}
					catch { }
				}
				if (changed) Changed?.Invoke();
			}
			catch (Exception ex)
			{
				Log.Write("check-in skipped: " + ex.Message);
			}
		}
	}

	/// <summary>"ReefAquarium.exe /selfupdate": check, download and install a newer version without any window.</summary>
	public static int SelfUpdate()
	{
		try
		{
			Exchange("update", ReefSettings.Load()).Wait();
			if (!UpdateAvailable)
			{
				Log.Write($"self-update: {Version} is the latest (service says {Current.LatestVersion})");
				return 0;
			}
			if (!CanUpdateInPlace()) { Log.Write("self-update: folder is not writable"); return 2; }
			string files = DownloadUpdate(null).GetAwaiter().GetResult();
			bool wallpaper = Wallpaper.IsRunning();
			if (wallpaper) Wallpaper.StopAll();
			ApplyUpdateAndRestart(files, wallpaper, openSettings: false);
			Log.Write($"self-update: {Version} -> {Current.LatestVersion} downloaded and verified; replacing files");
			return 0;
		}
		catch (Exception ex)
		{
			Log.Write("self-update failed: " + ex);
			return 1;
		}
	}

	private static string Str(JsonElement e, string name) => e.TryGetProperty(name, out JsonElement v) && v.ValueKind == JsonValueKind.String ? v.GetString() ?? "" : "";

	/// <summary>When a screensaver or wallpaper run ends: how long it ran (only when usage is shared). Waits at most 2 s.</summary>
	public static void SessionEnded(string mode, ReefSettings s)
	{
		if (Offline || !s.ShareUsage) return;
		double minutes = (DateTime.UtcNow - _started).TotalMinutes;
		if (minutes < 1) return;
		try
		{
			string? id = InstallId(true);
			if (id == null) return;
			using HttpClient c = Client();
			c.Timeout = TimeSpan.FromSeconds(2);
			using var content = new StringContent(JsonSerializer.Serialize(new { v = Version, id, kind = mode + "-end", data = new { minutes = Math.Round(minutes) } }), Encoding.UTF8, "application/json");
			c.PostAsync(Service + "/api/event", content).Wait(2000);
		}
		catch { }
	}

	// ------------------------------------------------------------------ self-update

	/// <summary>Is the folder the app runs from writable (needed to update in place)?</summary>
	public static bool CanUpdateInPlace()
	{
		try
		{
			string probe = Path.Combine(AppContext.BaseDirectory, ".update-test");
			File.WriteAllText(probe, "");
			File.Delete(probe);
			return true;
		}
		catch { return false; }
	}

	/// <summary>Downloads the new version, checks it against the published SHA-256 and unpacks it. Returns the unpacked folder.</summary>
	public static async Task<string> DownloadUpdate(IProgress<double>? progress, CancellationToken cancel = default)
	{
		State st = Current;
		if (!UpdateAvailable) throw new InvalidOperationException("No update is available.");
		string work = Path.Combine(Path.GetTempPath(), "ReefAquariumUpdate");
		if (Directory.Exists(work)) Directory.Delete(work, recursive: true);
		Directory.CreateDirectory(work);
		string zip = Path.Combine(work, "update.zip");
		using (var c = new HttpClient { Timeout = TimeSpan.FromMinutes(20) })
		{
			c.DefaultRequestHeaders.UserAgent.ParseAdd("ReefAquarium/" + Version + " updater");
			using HttpResponseMessage r = await c.GetAsync(st.Url, HttpCompletionOption.ResponseHeadersRead, cancel);
			r.EnsureSuccessStatusCode();
			long total = r.Content.Headers.ContentLength ?? st.Size;
			await using Stream src = await r.Content.ReadAsStreamAsync(cancel);
			await using FileStream dst = File.Create(zip);
			byte[] buf = new byte[1 << 16];
			long done = 0;
			int n;
			while ((n = await src.ReadAsync(buf, cancel)) > 0)
			{
				await dst.WriteAsync(buf.AsMemory(0, n), cancel);
				done += n;
				if (total > 0) progress?.Report(Math.Min(1.0, done / (double)total));
			}
		}
		string hash;
		await using (FileStream f = File.OpenRead(zip)) hash = Convert.ToHexString(await SHA256.HashDataAsync(f, cancel)).ToLowerInvariant();
		if (hash != st.Sha256) throw new InvalidDataException("The download didn't match the published file, so it was not installed.");
		string outDir = Path.Combine(work, "new");
		ZipFile.ExtractToDirectory(zip, outDir);
		File.Delete(zip);
		string? exe = Directory.GetFiles(outDir, "ReefAquarium.exe", SearchOption.AllDirectories).OrderBy(p => p.Length).FirstOrDefault();
		if (exe == null) throw new InvalidDataException("The download doesn't contain the app.");
		return Path.GetDirectoryName(exe)!;
	}

	/// <summary>
	/// Replaces the app's files with the unpacked new version and starts it again. The caller must exit right
	/// after this returns; the copy happens once this process is gone. Settings (UserData) are never touched.
	/// </summary>
	public static void ApplyUpdateAndRestart(string newFiles, bool restartWallpaper, bool openSettings = true)
	{
		string app = AppContext.BaseDirectory.TrimEnd('\\');
		string exe = Path.Combine(app, "ReefAquarium.exe");
		string script = Path.Combine(Path.GetTempPath(), "ReefAquariumUpdate", "apply.cmd");
		bool reinstallSaver = Installer.IsInstalled() && !string.Equals(Path.GetFullPath(Installer.InstallDir).TrimEnd('\\'), Path.GetFullPath(app), StringComparison.OrdinalIgnoreCase);
		var sb = new StringBuilder();
		sb.AppendLine("@echo off");
		sb.AppendLine(":wait");
		sb.AppendLine($"tasklist /fi \"PID eq {Environment.ProcessId}\" 2>nul | find \" {Environment.ProcessId} \" >nul && (timeout /t 1 /nobreak >nul & goto wait)");
		sb.AppendLine("set tries=0");
		sb.AppendLine(":copy");
		sb.AppendLine($"robocopy \"{newFiles}\" \"{app}\" /e /r:5 /w:1 /xd UserData >nul");
		sb.AppendLine("if not errorlevel 8 goto copied");
		sb.AppendLine("set /a tries+=1");
		sb.AppendLine("if %tries% lss 5 (timeout /t 2 /nobreak >nul & goto copy)");
		sb.AppendLine(":copied");
		if (reinstallSaver) sb.AppendLine($"\"{exe}\" /install quiet");
		if (restartWallpaper) sb.AppendLine($"start \"\" \"{exe}\" /wallpaper");
		if (openSettings) sb.AppendLine($"start \"\" \"{exe}\"");
		sb.AppendLine($"rmdir /s /q \"{Path.GetDirectoryName(newFiles.TrimEnd('\\'))}\" 2>nul");
		File.WriteAllText(script, sb.ToString(), Encoding.Default);
		Process.Start(new ProcessStartInfo("cmd.exe", $"/c \"\"{script}\"\"") { CreateNoWindow = true, UseShellExecute = false, WorkingDirectory = Path.GetTempPath() });
	}
}
