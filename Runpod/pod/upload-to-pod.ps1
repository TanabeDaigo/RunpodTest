# Upload server.compact.mjs to RunPod via ssh.runpod.io (PTY-friendly chunked base64)
# Usage (PowerShell):
#   .\upload-to-pod.ps1
#   .\upload-to-pod.ps1 -SshTarget "z1tb4ushc3bxic-64410e4e@ssh.runpod.io"

param(
  [string]$SshTarget = "z1tb4ushc3bxic-64410e4e@ssh.runpod.io",
  [string]$IdentityFile = "$env:USERPROFILE\.ssh\id_ed25519",
  [string]$LocalFile = "$PSScriptRoot\server.compact.mjs",
  [string]$RemoteDir = "/workspace/metroai-pod",
  [int]$ChunkSize = 500
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path $LocalFile)) { throw "Local file not found: $LocalFile" }
if (-not (Test-Path $IdentityFile)) { throw "SSH key not found: $IdentityFile" }

$bytes = [IO.File]::ReadAllBytes((Resolve-Path $LocalFile))
$b64 = [Convert]::ToBase64String($bytes)
Write-Host "Local bytes=$($bytes.Length) b64=$($b64.Length) chunks=$([Math]::Ceiling($b64.Length / $ChunkSize))"

$sshBase = @(
  "-tt",
  "-o", "StrictHostKeyChecking=accept-new",
  "-i", $IdentityFile,
  $SshTarget
)

function Invoke-Remote([string]$RemoteCmd) {
  & ssh @sshBase $RemoteCmd
  if ($LASTEXITCODE -ne 0) { throw "ssh failed ($LASTEXITCODE): $RemoteCmd" }
}

Invoke-Remote "mkdir -p $RemoteDir && rm -f $RemoteDir/server.mjs $RemoteDir/server.mjs.b64 && echo READY"

for ($i = 0; $i -lt $b64.Length; $i += $ChunkSize) {
  $n = [Math]::Floor($i / $ChunkSize) + 1
  $chunk = $b64.Substring($i, [Math]::Min($ChunkSize, $b64.Length - $i))
  Write-Host "upload chunk $n ..."
  # single quotes in chunk are impossible for base64 alphabet
  Invoke-Remote "printf '%s' '$chunk' >> $RemoteDir/server.mjs.b64"
}

Invoke-Remote "base64 -d $RemoteDir/server.mjs.b64 > $RemoteDir/server.mjs && wc -c $RemoteDir/server.mjs && node --check $RemoteDir/server.mjs && echo DONE"
Write-Host "Upload finished."
