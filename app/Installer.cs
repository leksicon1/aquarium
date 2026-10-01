using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using Microsoft.Win32;
using Reef.Engine;

namespace Reef;

public static class Installer
{
	private const int SPI_SETSCREENSAVEACTIVE = 17;

	private const int SPI_SETSCREENSAVETIMEOUT = 15;

	private const int SPIF = 3;

	public static string InstallDir => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Technology83", "ReefAquarium");

	public static string ScrPath => Path.Combine(InstallDir, "ReefAquarium.scr");

	[DllImport("user32.dll", CharSet = CharSet.Unicode)]
	private static extern bool SystemParametersInfoW(int action, int param, nint v, int winIni);

	public static void Install(bool quiet)
	{
		//IL_00ed: Unknown result type (might be due to invalid IL or missing references)
		string text = Environment.ProcessPath ?? throw new InvalidOperationException("no process path");
		Directory.CreateDirectory(InstallDir);
		string srcDir = Path.GetDirectoryName(Path.GetFullPath(text));
		if (!string.Equals(srcDir.TrimEnd('\\'), Path.GetFullPath(InstallDir).TrimEnd('\\'), StringComparison.OrdinalIgnoreCase))
		{
			// the screensaver needs the whole program next to it: runtime files, libraries and the art
			foreach (string f in Directory.GetFiles(srcDir, "*", SearchOption.AllDirectories))
			{
				string rel = Path.GetRelativePath(srcDir, f);
				string first = rel.Split(Path.DirectorySeparatorChar)[0];
				if (first.StartsWith("out", StringComparison.OrdinalIgnoreCase) || first.Equals("grok", StringComparison.OrdinalIgnoreCase)
					|| first.Equals("source", StringComparison.OrdinalIgnoreCase) || rel.EndsWith(".cmd", StringComparison.OrdinalIgnoreCase)
					|| rel.EndsWith(".log", StringComparison.OrdinalIgnoreCase) || (Path.GetFileName(rel).StartsWith("ReefAquarium_") && first == Path.GetFileName(rel)))
				{
					continue;
				}
				if (first.Equals("UserData", StringComparison.OrdinalIgnoreCase)) continue;   // settings live in the Windows profile
				string dst = Path.Combine(InstallDir, rel);
				Directory.CreateDirectory(Path.GetDirectoryName(dst));
				CopyOver(f, dst);
			}
			CopyOver(text, ScrPath);
		}
		else if (!File.Exists(ScrPath) || !string.Equals(Path.GetFullPath(text), Path.GetFullPath(ScrPath), StringComparison.OrdinalIgnoreCase))
		{
			CopyOver(text, ScrPath);
		}
		using (RegistryKey registryKey = Registry.CurrentUser.CreateSubKey("Control Panel\\Desktop"))
		{
			registryKey.SetValue("SCRNSAVE.EXE", ScrPath);
			registryKey.SetValue("ScreenSaveActive", "1");
			string text2 = registryKey.GetValue("ScreenSaveTimeOut")?.ToString();
			if (string.IsNullOrEmpty(text2) || text2 == "0")
			{
				registryKey.SetValue("ScreenSaveTimeOut", "600");
			}
		}
		SystemParametersInfoW(17, 1, 0, 3);
		Log.Write("installed to " + ScrPath);
		if (!quiet)
		{
			MessageBox.Show("Reef Aquarium is now your screensaver.\n\nOpen Screen Saver Settings to change the wait time or preview it.", "Reef Aquarium — Technology 83", (MessageBoxButtons)0, (MessageBoxIcon)64);
		}
	}

	/// <summary>
	/// Copies a file over an existing one even while the old one is in use (a running screensaver or wallpaper):
	/// Windows lets a loaded file be renamed, so the old copy steps aside and is cleared away on a later run.
	/// </summary>
	private static void CopyOver(string src, string dst)
	{
		try
		{
			foreach (string stale in Directory.GetFiles(Path.GetDirectoryName(dst)!, Path.GetFileName(dst) + ".old*"))
			{
				try { File.Delete(stale); } catch { }
			}
		}
		catch
		{
		}
		try
		{
			File.Copy(src, dst, overwrite: true);
		}
		catch (Exception ex) when (ex is IOException or UnauthorizedAccessException)
		{
			var a = new FileInfo(src);
			var b = new FileInfo(dst);
			if (b.Exists && a.Length == b.Length && a.LastWriteTimeUtc == b.LastWriteTimeUtc) return;   // same file already there
			File.Move(dst, dst + ".old" + DateTime.UtcNow.Ticks);
			File.Copy(src, dst, overwrite: true);
		}
	}

	public static void Uninstall()
	{
		using RegistryKey registryKey = Registry.CurrentUser.OpenSubKey("Control Panel\\Desktop", writable: true);
		if ((registryKey?.GetValue("SCRNSAVE.EXE")?.ToString() ?? "").Contains("ReefAquarium", StringComparison.OrdinalIgnoreCase))
		{
			registryKey.SetValue("SCRNSAVE.EXE", "");
			registryKey.SetValue("ScreenSaveActive", "0");
			SystemParametersInfoW(17, 0, 0, 3);
		}
	}

	/// <summary>Is Reef Aquarium the current Windows screensaver?</summary>
	public static bool IsInstalled()
	{
		try
		{
			using RegistryKey k = Registry.CurrentUser.OpenSubKey("Control Panel\\Desktop");
			return (k?.GetValue("SCRNSAVE.EXE")?.ToString() ?? "").Contains("ReefAquarium", StringComparison.OrdinalIgnoreCase);
		}
		catch { return false; }
	}

	/// <summary>Minutes of inactivity before the screensaver starts.</summary>
	public static int TimeoutMinutes
	{
		get
		{
			int sec = 0;
			unsafe { SystemParametersInfoW(14, 0, (nint)(&sec), 0); }
			return Math.Max(1, sec / 60);
		}
		set
		{
			SystemParametersInfoW(15, Math.Clamp(value, 1, 999) * 60, 0, 3);
		}
	}
}
