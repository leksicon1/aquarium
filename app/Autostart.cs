using Microsoft.Win32;

namespace Reef;

public static class Autostart
{
	private const string RunKey = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";

	public static void Set(bool on)
	{
		using RegistryKey registryKey = Registry.CurrentUser.CreateSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run");
		registryKey.DeleteValue("ReefAquariumWallpaper", throwOnMissingValue: false);   // name used before the rename
		if (on)
		{
			registryKey.SetValue("UltraAquariumWallpaper", "\"" + Installer.ScrPath + "\" /wallpaper");
		}
		else
		{
			registryKey.DeleteValue("UltraAquariumWallpaper", throwOnMissingValue: false);
		}
	}
}
