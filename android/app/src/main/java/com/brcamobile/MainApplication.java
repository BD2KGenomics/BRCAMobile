package com.brcamobile;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import android.support.annotation.NonNull;

// stetho
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.facebook.stetho.Stetho;
import okhttp3.OkHttpClient;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import java.util.concurrent.TimeUnit;

// react-native-fcm
import com.evollu.react.fcm.FIRMessagingPackage;

public class MainApplication extends NavigationApplication implements ReactApplication {
  // stetho
  public void onCreate() {
    super.onCreate();
    Stetho.initializeWithDefaults(this);
    OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(0, TimeUnit.MILLISECONDS)
      .readTimeout(0, TimeUnit.MILLISECONDS)
      .writeTimeout(0, TimeUnit.MILLISECONDS)
      .cookieJar(new ReactCookieJarContainer())
      .addNetworkInterceptor(new StethoInterceptor())
      .build();
    OkHttpClientProvider.replaceOkHttpClient(client);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new FIRMessagingPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

    /*
    // patched out in transition from 0.37 to 0.41
  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false); // second argument had "native exopackage" preceding it
  }
  */

  // react-native-navigation
  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  @NonNull
  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
      // Add the packages you require here.
      // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
        new FIRMessagingPackage()
      );
  }
}
