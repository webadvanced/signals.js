$scriptpath = split-path -parent $MyInvocation.MyCommand.Path
$nugetpath = resolve-path "$scriptpath/NuGet.exe"
$packagespath = resolve-path "$scriptpath/"



  pushd $packagespath
  


  # Find all the packages and display them for confirmation
  $packages = dir "*.nupkg"
  write-host "Packages to upload:"
  $packages | % { write-host $_.Name }

  # Ensure we haven't run this by accident.
  $yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", "Uploads the packages."
  $no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", "Does not upload the packages."
  $options = [System.Management.Automation.Host.ChoiceDescription[]]($no, $yes)
  
  $result = $host.ui.PromptForChoice("Upload packages", "Do you want to upload the NuGet packages to the NuGet server?", $options, 0) 
  
  # Cancelled
  if($result -eq 0) {
    "Upload aborted"
  }
  # upload
  elseif($result -eq 1) {
    $packages | % { 
        $package = $_.Name
        write-host "Uploading $package"
        & "$nugetpath" push $package 9e0c2822-9c7a-497e-85aa-36af5e45e41a
        write-host ""
    }
  }
  popd
