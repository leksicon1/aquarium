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

	/// <summary>Where the installer puts the app: %LocalAppData%\Programs\UltraAquarium (per user, no administrator rights).</summary>
	public static string ProgramDir => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "UltraAquarium");

	/// <summary>The folder the app is running from. The screensaver runs from here too: there is no second copy to go stale.</summary>
	public static string InstallDir => AppContext.BaseDirectory.TrimEnd('\\');

	/// <summary>The screensaver file Windows starts: the same program under the .scr name, next to the app.</summary>
	public static string ScrPath => Path.Combine(InstallDir, "UltraAquarium.scr");

	[DllImport("user32.dll", CharSet = CharSet.Unicode)]
	private static extern bool SystemParametersInfoW(int action, int param, nint v, int winIni);

	/// <summary>Makes sure the .scr twin of the program exists and matches it (the installer ships one; a portable copy makes its own).</summary>
	private static void EnsureScr()
	{
		string exe = Path.Combine(InstallDir, "UltraAquarium.exe");
		if (!File.Exists(exe)) return;
		var a = new FileInfo(exe);
		var b = new FileInfo(ScrPath);
		if (b.Exists && a.Length == b.Length && a.LastWriteTimeUtc == b.LastWriteTimeUtc) return;
		CopyOver(exe, ScrPath);
	}

	/// <summary>The screensaver path Windows currently has, or "".</summary>
	public static string CurrentScreensaver()
	{
		try
		{
			using RegistryKey k = Registry.CurrentUser.OpenSubKey("Control Panel\\Desktop");
			return k?.GetValue("SCRNSAVE.EXE")?.ToString() ?? "";
		}
		catch { return ""; }
	}

	public static void Install(bool quiet)
	{
		EnsureScr();
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
			MessageBox.Show("Ultra Aquarium is now your screensaver.\n\nOpen Screen Saver Settings to change the wait time or preview it.", "Ultra Aquarium — Technology 83", (MessageBoxButtons)0, (MessageBoxIcon)64);
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
		if ((registryKey?.GetValue("SCRNSAVE.EXE")?.ToString() ?? "").Contains("Aquarium.scr", StringComparison.OrdinalIgnoreCase))
		{
			registryKey.SetValue("SCRNSAVE.EXE", "");
			registryKey.SetValue("ScreenSaveActive", "0");
			SystemParametersInfoW(17, 0, 0, 3);
		}
	}

	/// <summary>Is Ultra Aquarium the current Windows screensaver?</summary>
	public static bool IsInstalled()
	{
		try
		{
			using RegistryKey k = Registry.CurrentUser.OpenSubKey("Control Panel\\Desktop");
			return (k?.GetValue("SCRNSAVE.EXE")?.ToString() ?? "").Contains("Aquarium.scr", StringComparison.OrdinalIgnoreCase);
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
