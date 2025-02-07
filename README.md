clone your code from (git clone https://gitlab.com/VBCRADIUS/mobile_app.git)
recent updated pushed in "new_customer_version" branch, your can pull from this branch to create your
required branch

# Project Name

VBC ADMIN APP (pull your code from branch new_customer_version)

## Prerequisites

for the admin application we are using yarn to install packages . PLZ INSTALL YARN in ur env

Before setting up the project, ensure you have the following software installed on your system:

NOTE: here we are use yarn insted of npm install from package.json

- **Node.js**: Version 16.20.6
- **Java**: Version 11.0.20 (https://community.chocolatey.org/packages/microsoft-openjdk11)

```sh
brew install node@20.10.0
```

## POSSIBLE ISSUES

in case you are face "Installed Build Tools revision 31.0.0 is corrupted" plz check this discuss change d8 to dx in required file

https://stackoverflow.com/questions/68387270/android-studio-error-installed-build-tools-revision-31-0-0-is-corrupted

####################################

# Project Name

VBC CUSTOMER APP(Pull your code from branch new_customer_version)

## Prerequisites

Before setting up the project, ensure you have the following software installed on your system:

- **Node.js**: Version 20.10.0
- **Java**: Version 17.0.11 (install with chocolatey)

### Node.js

To install Node.js, follow these steps:

#### Windows

Install NVM to handle old and recent version of Node

Download the installer from the [official Node.js website](https://nodejs.org/) and follow the instructions.

#### macOS

You can use Homebrew to install Node.js:

```sh
brew install node@20.10.0
```

#### debug application

https://docs.infinite.red/reactotron/quick-start/react-native/
refer this uri

#### possible issues

you may face some issues after installing react-native-i18n etc... to resolve follow this steps

Here is how you can resolve the issue:

Locate the build.gradle file: The error message indicates that the problematic file is located at D:\Apps\reactNativeApps\mobileapp\Admin\node_modules\react-native-i18n\android\build.gradle.

Update the Dependency Declaration: Open the build.gradle file and find the line that uses the compile method. Replace compile with implementation.

For example, if you see a line like this:

gradle
Copy code
compile 'com.facebook.react:react-native:+'

Change it to:
gradle
Copy code
implementation 'com.facebook.react:react-native:+'
