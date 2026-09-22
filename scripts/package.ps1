$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Push-Location $projectRoot
try {
    node build.js
    if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
    node --test tests/pip.test.js
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
    $manifest = Get-Content manifest.json -Raw | ConvertFrom-Json
    $packageName = "crunchyroll-pip-$($manifest.version).zip"
    New-Item -ItemType Directory -Force dist | Out-Null
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archivePath = Join-Path $projectRoot "dist/$packageName"
    $stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
    $archive = New-Object System.IO.Compression.ZipArchive($stream, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files = @('manifest.json', 'background.js', 'pip.js', 'content.js', 'PRIVACY.md', 'LICENSE', 'INSTALL.txt',
            'icons/icon-16.png', 'icons/icon-32.png', 'icons/icon-48.png', 'icons/icon-128.png')
        foreach ($file in $files) {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, (Join-Path $projectRoot $file), $file) | Out-Null
        }
    } finally { $archive.Dispose(); $stream.Dispose() }
    $hash = (Get-FileHash $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash  $packageName" | Set-Content dist/SHA256SUMS.txt -Encoding ascii
    Write-Output "Package ready: $archivePath"
} finally { Pop-Location }
