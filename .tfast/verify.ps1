param([Parameter(Mandatory=$true)][string]$Vsix)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$packagePath = (Resolve-Path -LiteralPath $Vsix).Path
$archive = [System.IO.Compression.ZipFile]::OpenRead($packagePath)
try {
    $entry = $archive.GetEntry('extension/package.json')
    if (-not $entry) { throw 'Missing extension manifest' }
    $reader = New-Object System.IO.StreamReader($entry.Open())
    try { $manifest = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
    if ($manifest.name -ne 'tfast-dev-ai' -or $manifest.publisher -ne 'tfastdigital') { throw 'Incorrect extension identity' }
    $bundle = $archive.GetEntry('extension/dist/extension.js')
    if (-not $bundle -or $bundle.Length -lt 100000) { throw 'Missing or incomplete extension bundle' }
    $assets = @($archive.Entries | Where-Object { $_.FullName -like 'extension/webview-ui/build/assets/*.js' })
    if ($assets.Count -eq 0) { throw 'Missing webview JavaScript' }
    if (-not ($archive.Entries | Where-Object { $_.FullName -match '^extension/LICENSE(\.md|\.txt)?$' })) { throw 'Missing license' }
    foreach ($command in $manifest.contributes.commands) {
        if (-not $command.command.StartsWith('tfast-dev-ai.')) { throw "Unexpected command: $($command.command)" }
    }
} finally { $archive.Dispose() }
$destination = Join-Path $PSScriptRoot ('tools/vsix-' + [guid]::NewGuid().ToString('N'))
[System.IO.Compression.ZipFile]::ExtractToDirectory($packagePath, $destination)
$env:TFAST_SMOKE_EXTENSION_DIR = Join-Path $destination 'extension'
if (-not $env:TFAST_VSCODE_EXECUTABLE) {
    $env:TFAST_VSCODE_EXECUTABLE = Join-Path $env:LOCALAPPDATA 'Programs/Microsoft VS Code/Code.exe'
}
if (-not (Test-Path -LiteralPath $env:TFAST_VSCODE_EXECUTABLE)) { throw 'Set TFAST_VSCODE_EXECUTABLE to your Code.exe path' }
$ErrorActionPreference = 'Continue'
& node (Join-Path $PSScriptRoot 'smoke.mjs')
$ErrorActionPreference = 'Stop'
if ($LASTEXITCODE -ne 0) { throw 'VS Code activation smoke test failed' }
Get-FileHash -LiteralPath $packagePath -Algorithm SHA256
Get-Content (Join-Path $PSScriptRoot 'artifacts/host-smoke.json')
