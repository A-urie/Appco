param()

# Repair script for double-encoded UTF-8 (mojibake).
# Root cause: PowerShell WriteAllText/WriteAllLines without an explicit encoding
# re-encoded already-UTF8 bytes as if they were Windows-1252.
# Reverse transform: text -> Windows-1252 bytes -> decode as UTF-8, repeated
# until the suspicious-character score stops decreasing.

$ErrorActionPreference = 'Stop'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)
$suspect = [char]0x00C3 + '|' + [char]0x00C2 + '|' + [char]0x00E2 + '|' + [char]0x0192

function Get-Score([string]$text) {
    return ([regex]::Matches($text, $suspect)).Count
}

function Repair-Text([string]$text) {
    $best = $text
    $bestScore = Get-Score $text
    if ($bestScore -eq 0) { return $best }
    for ($round = 1; $round -le 4; $round++) {
        $candidate = $utf8.GetString($cp1252.GetBytes($best))
        if ($candidate.Contains([char]0xFFFD)) { break }
        $score = Get-Score $candidate
        if ($score -ge $bestScore) { break }
        $best = $candidate
        $bestScore = $score
        if ($bestScore -eq 0) { break }
    }
    return $best
}

$roots = @('src', 'public\js', 'public\css')
$skip = '\\node_modules\\|\\.git\\|bootstrap\.min\.css$|jquery.*\.min\.js$|owl.*\.min\.js$|magnific.*\.min\.js$|themify.*\.min\.css$|magnific-popup\.css$|owl\.carousel\.min\.css$'

$files = foreach ($root in $roots) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -File |
            Where-Object { $_.FullName -notmatch $skip } |
            Where-Object { $_.Extension -in '.ts', '.html', '.scss', '.css', '.js', '.json', '.md' }
    }
}

$repaired = @()
$clean = @()
foreach ($file in $files) {
    $text = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $before = Get-Score $text
    if ($before -eq 0) { $clean += $file.FullName; continue }
    $fixed = Repair-Text $text
    $after = Get-Score $fixed
    if ($after -lt $before) {
        [System.IO.File]::WriteAllText($file.FullName, $fixed, $utf8)
        $repaired += [pscustomobject]@{ File = $file.FullName.Replace($PWD.Path + '\', ''); Before = $before; After = $after }
    } else {
        $repaired += [pscustomobject]@{ File = $file.FullName.Replace($PWD.Path + '\', '') + ' [IRRECOVERABLE]'; Before = $before; After = $after }
    }
}

"=== REPAIRES ($($repaired.Count)) ==="
$repaired | ForEach-Object { "  {0,-62} {1} -> {2}" -f $_.File, $_.Before, $_.After }
"=== CLEAN FILES SCANNED: $($clean.Count) ==="