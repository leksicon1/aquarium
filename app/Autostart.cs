using Microsoft.Win32;

namespace Reef;

public static class Autostart
{
	private const string RunKey = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";

	public static void Set(bool on)
	{
		using RegistryKey registryKey = Registry.CurrentUser.CreateSubKey("Software\\Microsoft\\Windows\\CurrentVersion\\Run");
		if (on)
		{
			registryKey.SetValue("ReefAquariumWallpaper", "\"" + Installer.ScrPath + "\" /wallpaper");
		}
		else
		{
			registryKey.DeleteValue("ReefAquariumWallpaper", throwOnMissingValue: false);
		}
	}
}
