param([Parameter(Mandatory)][ScriptBlock]$Script)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding
$tf = Join-Path ".codex_tmp" ("run_{0}.ps1" -f ([guid]::NewGuid()))
"Set-StrictMode -Version Latest`n$($Script.ToString())" |
  Out-File -FilePath $tf -Encoding utf8NoBOM -Force
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $tf