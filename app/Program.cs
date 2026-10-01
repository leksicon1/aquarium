using System;
using System.Globalization;
using System.Windows.Forms;
using Reef.Engine;
using Reef.UI;

namespace Reef;

public static class Program
{
	[STAThread]
	public static int Main(string[] args)
	{
		//IL_00db: Unknown result type (might be due to invalid IL or missing references)
		AppDomain.CurrentDomain.UnhandledException += (_, e) => Log.Write("UNHANDLED " + e.ExceptionObject);
		TaskScheduler.UnobservedTaskException += (_, e) => { Log.Write("TASK " + e.Exception); e.SetObserved(); };
		Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
		Application.ThreadException += (_, e) =>
		{
			Log.Write("UI " + e.Exception);
			try { MessageBox.Show("Something went wrong: " + e.Exception.Message + "\n\nDetails were saved to the diagnostics log.", "Reef Aquarium"); } catch { }
		};
		Win32.EnableDpiAwareness();
		CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
		if (args.Length > 0 && args[0].TrimStart('/', '-').Equals("selfupdate", StringComparison.OrdinalIgnoreCase)) return Online.SelfUpdate();
		Options options = Parse(args);
		try
		{
			switch (options.Mode)
			{
			case Mode.Config:
				Application.EnableVisualStyles();
				Application.SetCompatibleTextRenderingDefault(false);
				Application.SetHighDpiMode((HighDpiMode)3);
				// the window is rebuilt for the new screen when it is dragged to one with different display scaling
				do
				{
					SettingsForm.Reopen = false;
					Application.Run(new SettingsForm());
				}
				while (SettingsForm.Reopen);
				return 0;
			case Mode.Install:
				Installer.Install(options.Layout == "quiet");
				return 0;
			case Mode.Uninstall:
				Installer.Uninstall();
				return 0;
			default:
			{
				using (Host host = new Host(options))
				{
					host.Run();
				}
				if (options.Mode is Mode.Full or Mode.Wallpaper)
				{
					Online.SessionEnded(options.Mode == Mode.Full ? "screensaver" : "wallpaper", ReefSettings.Load());
				}
				return 0;
			}
			}
		}
		catch (Exception ex)
		{
			Log.Write("FATAL " + ex);
			Mode mode = options.Mode;
			if ((mode == Mode.Config || mode == Mode.Window || mode == Mode.Install) ? true : false)
			{
				try
				{
					MessageBox.Show(ex.Message, "Reef Aquarium", (MessageBoxButtons)0, (MessageBoxIcon)16);
				}
				catch
				{
				}
			}
			return 1;
		}
	}

	private static Options Parse(string[] args)
	{
		Options options = new Options();
		if (args.Length == 0)
		{
			return options;
		}
		string text = args[0].Trim().ToLowerInvariant();
		if (text.StartsWith("/") || text.StartsWith("-"))
		{
			text = "/" + text.TrimStart('/', '-');
		}
		switch (text)
		{
		case "/s":
			options.Mode = Mode.Full;
			break;
		case "/install":
			options.Mode = Mode.Install;
			if (args.Length > 1)
			{
				options.Layout = args[1];
			}
			break;
		case "/uninstall":
			options.Mode = Mode.Uninstall;
			break;
		case "/stopwallpaper":
			Wallpaper.StopAll();
			Environment.Exit(0);
			break;
		case "/wallpaper":
			options.Mode = Mode.Wallpaper;
			break;
		case "/w":
		case "/window":
			options.Mode = Mode.Window;
			break;
		case "/snapshot":
			options.Mode = Mode.Snapshot;
			break;
		default:
			if (text.StartsWith("/c"))
			{
				options.Mode = Mode.Config;
			}
			else if (text.StartsWith("/p"))
			{
				options.Mode = Mode.Preview;
				object s;
				if (!text.Contains(':'))
				{
					s = ((args.Length > 1) ? args[1] : "0");
				}
				else
				{
					string text2 = text;
					int num = text.IndexOf(':') + 1;
					s = text2.Substring(num, text2.Length - num);
				}
				if (long.TryParse((string?)s, out var result))
				{
					options.PreviewHwnd = (nint)result;
				}
			}
			break;
		}
		for (int i = 1; i < args.Length; i++)
		{
			string text3 = args[i].ToLowerInvariant();
			string text4 = ((i + 1 < args.Length) ? args[i + 1] : null);
			switch (text3)
			{
			case "--size":
			{
				string[] array = text4.ToLowerInvariant().Split('x');
				options.Width = int.Parse(array[0]);
				options.Height = int.Parse(array[1]);
				i++;
				break;
			}
			case "--layout":
				options.Layout = text4;
				i++;
				break;
			case "--out":
				options.OutPath = text4;
				i++;
				break;
			case "--seed":
				options.Seed = int.Parse(text4);
				i++;
				break;
			case "--hour":
				options.Hour = F(text4);
				i++;
				break;
			case "--warm":
				options.Warm = F(text4);
				i++;
				break;
			case "--event":
				options.Event = text4;
				i++;
				break;
			case "--text":
				options.Text = text4;
				i++;
				break;
			case "--textmodes":
				options.TextModes = text4;
				i++;
				break;
			case "--frames":
				options.Frames = int.Parse(text4);
				i++;
				break;
			case "--fps":
				options.Fps = F(text4);
				i++;
				break;
			case "--quality":
				options.Quality = text4;
				i++;
				break;
			case "--settings":
				options.SettingsPath = text4;
				i++;
				break;
			case "--scale":
				options.Scale = F(text4);
				i++;
				break;
			case "--debug":
				Options.Debug = text4 ?? "";
				i++;
				break;
			case "--seconds":
				Options.RunSeconds = F(text4);
				i++;
				break;
			case "--bench":
				options.Bench = int.Parse(text4);
				i++;
				break;
			}
		}
		return options;
		static float F(string? x)
		{
			return float.Parse(x, CultureInfo.InvariantCulture);
		}
	}
}
