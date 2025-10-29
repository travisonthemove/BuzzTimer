Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$proc = Start-Process -FilePath 'python' -ArgumentList 'start_server.py' -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2
try {
    $root = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -UseBasicParsing
    $share = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/index.html' -UseBasicParsing
    "RootStatus:$($root.StatusCode)"
    "IndexLength:$($share.Content.Length)"
}
finally {
    if ($proc -and -not $proc.HasExited) {
        $proc.Kill()
        $proc.WaitForExit()
    }
}