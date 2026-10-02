using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Reef;

public sealed class ReefSettings
{
	private static readonly JsonSerializerOptions Json = new JsonSerializerOptions
	{
		WriteIndented = true,
		Converters = { (JsonConverter)new JsonStringEnumConverter() },
		ReadCommentHandling = JsonCommentHandling.Skip,
		AllowTrailingCommas = true
	};

	public int Version { get; set; } = 2;


	public float FishDensity { get; set; } = 1f;


	public float SwimSpeed { get; set; } = 1f;


	public float Brightness { get; set; } = 1f;


	public float WaterClarity { get; set; } = 1.6f;


	public float GodRays { get; set; } = 1f;


	public float Caustics { get; set; } = 1f;


	public bool Bubbles { get; set; } = true;


	public bool MarineSnow { get; set; } = true;


	public bool SurfaceVisible { get; set; } = true;


	public int ReefSeed { get; set; }

	public Dictionary<string, bool> Species { get; set; } = new Dictionary<string, bool>();


	public TimeMode Time { get; set; }

	public EventFrequency Events { get; set; } = EventFrequency.Normal;


	public bool EventTurtle { get; set; } = true;


	public bool EventManta { get; set; } = true;


	public bool EventShark { get; set; } = true;


	public bool EventWhale { get; set; } = true;


	public bool EventBaitBall { get; set; } = true;


	public bool Sound { get; set; }

	public float Volume { get; set; } = 0.5f;


	public bool SoundInScreensaver { get; set; }

	public TextSettings Text { get; set; } = new TextSettings();


	public List<CustomFish> MyFish { get; set; } = new List<CustomFish>();

	/// <summary>Monitors that show the reef (screensaver and live wallpaper). Empty = all of them.</summary>
	public List<string> Screens { get; set; } = new List<string>();

	/// <summary>Show the live preview at the top of the settings window.</summary>
	public bool SettingsPreview { get; set; } = true;

	/// <summary>Live wallpaper graphics: 0 = fastest GPU, 1 = the GPU wired to the screen (hybrid laptops).</summary>
	public int GpuChoice { get; set; } = 1;


	public QualityPreset Quality { get; set; }

	/// <summary>1 (lightest) .. 10 (ultra). Starts at the lightest level; users ramp it up.</summary>
	public int QualityLevel { get; set; } = 1;

	/// <summary>Resolution the reef is rendered at (1 = full). Independent of the quality level.</summary>
	public float RenderScale { get; set; } = 1f;

	/// <summary>Lower the resolution automatically when the frame rate can't be held.</summary>
	public bool AdaptiveResolution { get; set; }

	/// <summary>How much coral grows on the reef (1 = normal). Independent of the quality level.</summary>
	public float CoralDensity { get; set; } = 1f;

	/// <summary>Shadow map size: -1 = follow quality level, 0 = off, else 512..4096.</summary>
	public int ShadowResolution { get; set; } = -1;

	/// <summary>Shadow edges: -1 = follow quality, 0 hard, 1 soft, 2 extra soft.</summary>
	public int ShadowFilter { get; set; } = -1;

	public float ShadowSoftness { get; set; } = 0.5f;

	public float ShadowStrength { get; set; } = 1f;

	public bool FishShadows { get; set; } = true;

	public bool PlantShadows { get; set; } = true;

	/// <summary>Multisample anti-aliasing: 0 = follow quality, else 1/2/4/8.</summary>
	public int Antialiasing { get; set; }

	/// <summary>Very slow, subtle drifting camera.</summary>
	public bool CameraDrift { get; set; }

	public float CameraDriftAmount { get; set; } = 0.5f;

	/// <summary>On-screen frame rate and GPU statistics.</summary>
	public bool ShowStats { get; set; }

	/// <summary>Key that drops fish food (a Windows virtual-key code; 0x46 = F, 0 = none).</summary>
	public int FeedKey { get; set; } = 0x46;

	/// <summary>Share anonymous usage figures with Technology 83 (About page). Update checks happen either way.</summary>
	public bool ShareUsage { get; set; } = true;
	public EffectQuality Shadows { get; set; }
	public EffectQuality LightShafts { get; set; }
	public EffectQuality Bloom { get; set; }

	public int BezelPixels { get; set; }

	public Projection Projection { get; set; }

	public float CurveDegrees { get; set; } = 25f;


	public int FpsCap { get; set; }

	public int WallpaperFps { get; set; } = 0;


	public bool WallpaperPauseOnBattery { get; set; } = true;


	public bool WallpaperStartWithWindows { get; set; }

	public float FieldOfView { get; set; } = 1f;


	[JsonIgnore]
	/// <summary>
	/// One settings folder per Windows user (%AppData%\Technology83\UltraAquarium), shared by the app wherever it
	/// runs from - the unzipped folder, the installed screensaver copy, or a newer version after an update.
	/// REEF_DATA overrides it. Settings from an older "UserData" folder beside the app move over once.
	/// </summary>
	public static string Folder => _folder ??= ResolveFolder();

	private static string? _folder;

	private static string ResolveFolder()
	{
		string? env = Environment.GetEnvironmentVariable("REEF_DATA");
		if (!string.IsNullOrEmpty(env)) return env;
		string root = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Technology83");
		string dir = Path.Combine(root, "UltraAquarium");
		try
		{
			if (!File.Exists(Path.Combine(dir, "settings.json")))
			{
				// settings from before the app was renamed (Reef Aquarium 6), or from a UserData folder beside the app
				foreach (string old in new[] { Path.Combine(root, "ReefAquarium6"), Path.Combine(AppContext.BaseDirectory, "UserData") })
				{
					if (!File.Exists(Path.Combine(old, "settings.json"))) continue;
					Directory.CreateDirectory(dir);
					foreach (string f in Directory.GetFiles(old))
					{
						if (!f.EndsWith(".log", StringComparison.OrdinalIgnoreCase)) File.Copy(f, Path.Combine(dir, Path.GetFileName(f)), overwrite: false);
					}
					break;
				}
			}
		}
		catch
		{
		}
		return dir;
	}

	[JsonIgnore]
	public static string FilePath => Path.Combine(Folder, "settings.json");

	public static ReefSettings Load(string? path = null)
	{
		try
		{
			string path2 = path ?? FilePath;
			if (File.Exists(path2))
			{
				ReefSettings reefSettings = JsonSerializer.Deserialize<ReefSettings>(File.ReadAllText(path2), Json);
				if (reefSettings != null)
				{
					reefSettings.Sanitize();
					return reefSettings;
				}
			}
		}
		catch
		{
		}
		ReefSettings reefSettings2 = new ReefSettings();
		reefSettings2.Sanitize();
		return reefSettings2;
	}

	public void Save()
	{
		Directory.CreateDirectory(Folder);
		string text = FilePath + ".tmp";
		File.WriteAllText(text, JsonSerializer.Serialize(this, Json));
		File.Move(text, FilePath, overwrite: true);
	}

	public ReefSettings Clone()
	{
		return JsonSerializer.Deserialize<ReefSettings>(JsonSerializer.Serialize(this, Json), Json);
	}

	public string ToJson()
	{
		return JsonSerializer.Serialize(this, Json);
	}

	public void Sanitize()
	{
		FishDensity = Math.Clamp(FishDensity, 0.2f, 3f);
		SwimSpeed = Math.Clamp(SwimSpeed, 0.4f, 1.8f);
		Brightness = Math.Clamp(Brightness, 0.5f, 1.6f);
		WaterClarity = 1.6f;   // always crystal clear (the slider was removed in 6.2)
		if (FeedKey != 0 && (FeedKey < 0x20 || FeedKey > 0x7B)) FeedKey = 0x46;
		GodRays = Math.Clamp(GodRays, 0f, 2f);
		Caustics = Math.Clamp(Caustics, 0f, 2f);
		Volume = Math.Clamp(Volume, 0f, 1f);
		RenderScale = RenderScale <= 0f ? 1f : Math.Clamp(RenderScale, 0.4f, 1f);
		CoralDensity = Math.Clamp(CoralDensity, 0.3f, 2f);
		// older settings: a fixed Off/On shadow choice becomes an explicit shadow size
		if (ShadowResolution < 0 && Shadows == EffectQuality.Off) ShadowResolution = 0;
		if (ShadowResolution < 0 && Shadows == EffectQuality.On) ShadowResolution = 2048;
		Shadows = EffectQuality.Preset;
		if (ShadowResolution > 0) ShadowResolution = ShadowResolution <= 512 ? 512 : ShadowResolution <= 1024 ? 1024 : ShadowResolution <= 2048 ? 2048 : 4096;
		ShadowFilter = Math.Clamp(ShadowFilter, -1, 2);
		ShadowSoftness = Math.Clamp(ShadowSoftness, 0f, 1f);
		ShadowStrength = Math.Clamp(ShadowStrength, 0f, 1f);
		Antialiasing = Antialiasing is 1 or 2 or 4 or 8 ? Antialiasing : 0;
		CameraDriftAmount = Math.Clamp(CameraDriftAmount, 0f, 1f);
		GpuChoice = Math.Clamp(GpuChoice, 0, 1);
		QualityLevel = Math.Clamp(QualityLevel, 1, 10);
		if (!Enum.IsDefined(Shadows)) Shadows = EffectQuality.Preset;
		if (!Enum.IsDefined(LightShafts)) LightShafts = EffectQuality.Preset;
		if (!Enum.IsDefined(Bloom)) Bloom = EffectQuality.Preset;
		BezelPixels = Math.Clamp(BezelPixels, 0, 400);
		CurveDegrees = Math.Clamp(CurveDegrees, 0f, 60f);
		FieldOfView = Math.Clamp(FieldOfView, 0.7f, 1.4f);
		WallpaperFps = WallpaperFps <= 0 ? 0 : Math.Clamp(WallpaperFps, 10, 400);   // 0 = match the display
		FpsCap = Math.Clamp(FpsCap, 0, 240);
		if (Text == null)
		{
			TextSettings textSettings2 = (Text = new TextSettings());
		}
		Text.Size = Math.Clamp(Text.Size, 0.3f, 3f);
		Text.VerticalPosition = Math.Clamp(Text.VerticalPosition, 0.05f, 0.95f);
		Text.CycleMinutes = Math.Clamp(Text.CycleMinutes, 0.25f, 60f);
		Screens ??= new List<string>();
		if (MyFish == null)
		{
			List<CustomFish> list2 = (MyFish = new List<CustomFish>());
		}
		if (Species == null)
		{
			Dictionary<string, bool> dictionary2 = (Species = new Dictionary<string, bool>());
		}
		foreach (CustomFish item in MyFish)
		{
			item.Count = Math.Clamp(item.Count, 1, 300);
			item.Length = Math.Clamp(item.Length, 0.04f, 1.2f);
		}
	}

	public bool SpeciesEnabled(string id)
	{
		bool value;
		return !Species.TryGetValue(id, out value) || value;
	}
}
