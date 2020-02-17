# tito Registration App

 Improved checkin app for [ti.to](https://ti.to/) events, based on the order number, which is an auto-increment.
 
- Google Play: https://play.google.com/store/apps/details?id=com.revojs.registration
- App Store: https://apps.apple.com/us/app/ti-to-registration/id1483743059
 
 Built with React Native, using Expo.

## Development

To run the app there follow the instructions from [expo-cli](https://docs.expo.io/versions/latest/get-started/installation/).

Then run:
```
expo start
```

## Release

To create a build, run:

```
expo build:ios
expo build:android
```

For iOS, validate the build:
```
xcrun altool --validate-app -f [build_name.ipa] -t ios -u [email] -p [password]
```
To upload the build on TestFlight:
```
xcrun altool --upload-app -f [build_name.ipa] -t ios -u [email] -p [password]
```

## Privacy Policy

To use this app, we need an **Api Key** from ti.to and your **Team Slug**.
This data is stored ONLY on your device. We don't save it on our servers or any other 3rd party service.

Read more about our [Privacy Policy](./privacy-policy.md).
