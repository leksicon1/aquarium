#!/usr/bin/env python3
"""mkmsi.py STAGE VERSION OUT.msi : per-user Windows Installer package for Ultra Aquarium (built with wixl)."""
import os, sys, uuid, hashlib, subprocess
from xml.sax.saxutils import escape, quoteattr
stage, version, out = sys.argv[1:4]
NS = uuid.UUID('7d1f0c7e-5a0b-4c58-9a57-83a0c0f3a183')
UPGRADE = '{6B1E9C52-0F4A-4E0B-9B7D-83AA7E5A0183}'   # never changes: lets a new version replace an old one
def ident(prefix, rel): return prefix + hashlib.sha1(rel.encode()).hexdigest()[:30].upper()
tree = {}
for root, dirs, files in os.walk(stage):
    dirs.sort()
    rel = os.path.relpath(root, stage)
    tree[rel] = sorted(files)
comps = []
def emit(rel, depth):
    pad = '  ' * depth
    x = ''
    for f in tree.get(rel, []):
        r = f if rel == '.' else rel + '/' + f
        cid = ident('c', r)
        comps.append(cid)
        x += f'{pad}<Component Id="{cid}" Guid="{{{str(uuid.uuid5(NS, r)).upper()}}}" Win64="yes"><File Id="{ident("f", r)}" KeyPath="yes" Name={quoteattr(f)} Source={quoteattr(os.path.join(stage, r))}/></Component>\n'
    for d in sorted(k for k in tree if k != '.' and os.path.dirname(k) == ('' if rel == '.' else rel)):
        x += f'{pad}<Directory Id="{ident("d", d)}" Name={quoteattr(os.path.basename(d))}>\n' + emit(d, depth + 1) + f'{pad}</Directory>\n'
    return x
body = emit('.', 5)
wxs = f'''<?xml version="1.0" encoding="utf-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Product Id="*" Name="Ultra Aquarium" Language="1033" Version="{version}" Manufacturer="Technology 83 Systems Ltd." UpgradeCode="{UPGRADE}">
    <Package InstallerVersion="500" Compressed="yes" InstallScope="perUser" Description="Ultra Aquarium {version}" Comments="A living 3D aquarium screensaver and live wallpaper" Manufacturer="Technology 83 Systems Ltd."/>
    <MajorUpgrade AllowSameVersionUpgrades="yes" DowngradeErrorMessage="A newer version of Ultra Aquarium is already installed."/>
    <Media Id="1" Cabinet="app.cab" EmbedCab="yes"/>
    <Icon Id="app.ico" SourceFile="{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'msi', 'app.ico')}"/>
    <Property Id="ARPPRODUCTICON" Value="app.ico"/>
    <Property Id="ARPURLINFOABOUT" Value="https://aquarium.technology83.com"/>
    <Property Id="ARPNOMODIFY" Value="1"/>
    <!-- Always write every file. Without this, Windows Installer keeps an existing file whose version looks
         newer or equal, then removes it along with the old version, and the upgrade ends up with files missing. -->
    <Property Id="REINSTALLMODE" Value="amus"/>
    <Property Id="ALLUSERS" Secure="yes"/>
    <Directory Id="TARGETDIR" Name="SourceDir">
      <Directory Id="LocalAppDataFolder">
        <Directory Id="ProgramsDir" Name="Programs">
          <Directory Id="INSTALLDIR" Name="UltraAquarium">
{body}          </Directory>
        </Directory>
      </Directory>
      <Directory Id="ProgramMenuFolder">
        <Component Id="cShortcut" Guid="{{{str(uuid.uuid5(NS, 'shortcut')).upper()}}}">
          <Shortcut Id="sStart" Name="Ultra Aquarium" Description="Aquarium screensaver and live wallpaper" Target="[INSTALLDIR]UltraAquarium.exe" WorkingDirectory="INSTALLDIR" Icon="app.ico"/>
          <RegistryValue Root="HKCU" Key="Software\\Technology83\\UltraAquarium" Name="Installed" Type="integer" Value="1" KeyPath="yes"/>
        </Component>
      </Directory>
    </Directory>
    <CustomAction Id="LaunchApp" FileKey="{ident("f", "UltraAquarium.exe")}" ExeCommand="" Return="asyncNoWait" Execute="immediate"/>
    <InstallExecuteSequence>
      <Custom Action="LaunchApp" After="InstallFinalize">NOT REMOVE AND NOT NOLAUNCH</Custom>
    </InstallExecuteSequence>
    <Feature Id="Main" Title="Ultra Aquarium" Level="1">
''' + ''.join(f'      <ComponentRef Id="{c}"/>\n' for c in comps) + '''      <ComponentRef Id="cShortcut"/>
    </Feature>
  </Product>
</Wix>
'''
open(out + '.wxs', 'w').write(wxs)
subprocess.check_call(['wixl', '-a', 'x64', '-o', out, out + '.wxs'])
print(out, os.path.getsize(out))
