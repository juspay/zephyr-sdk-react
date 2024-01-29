# Zephyr SDK React

Zephyr SDK React is a React Native component which enables you to seamlessly integrate and use [Breeze 1 Click Checkout](https://breeze.in/) in your React Native app.

Find the [interactive documentation here](https://juspay.github.io/zephyr-sdk-react/).

## Installation

In your react native project directory, run the following command:

```sh
npm install @juspay/zephyr-sdk-react
```

This will install the Zephyr SDK React package in your project.

## Usage

### Importing the package

```js
import { Zephyr } from '@juspay/zephyr-sdk-react';
```

### Opening the Checkout View

```jsx
<Zephyr
  configuration={zephyrConfig}
  callbacks={zephyrCallbacks}
  checkoutPayload={{ cart: userCart }}
  ref={zephyrRef}
  style={{ height: 500, width: 500 }}
/>
```

### Parameters for Zephyr Component

| Parameter       | Type   | Description                                                                       |
| --------------- | ------ | --------------------------------------------------------------------------------- |
| configuration   | object | Configuration object for Zephyr SDK.                                              |
| callbacks       | object | Callbacks object for Zephyr SDK.                                                  |
| checkoutPayload | object | Payload object for Zephyr SDK.                                                    |
| ref             | object | Ref object for Zephyr SDK.                                                        |
| style           | object | Optional style object for Zephyr SDK. Control the dimensions of the Checkout view |

Extensive documentation for each of the above parameters can be found [here](https://juspay.github.io/zephyr-sdk-react/#md:zephyr-sdk-react)

### Configuration Object

| Parameter    | Type   | Description                                                                      |
| ------------ | ------ | -------------------------------------------------------------------------------- |
| merchantId   | string | Merchant ID provided by Juspay.                                                  |
| shopUrl      | string | URL of your shop/store                                                           |
| shopPlatform | string | Platform of your shop/store. Possible values are `shopify`.                      |
| environment  | string | Environment to be used for the SDK. Possible values are `production` and `beta`. |

### Callbacks Object

| Parameter  | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| onEvent    | function | Callback for handling events emitted by Zephyr SDK. |
| onComplete | function | Callback for handling successful checkout.          |
| onError    | function | Callback for handling errors during checkout.       |
| onClose    | function | Callback for handling close of Zephyr Checkout.     |

### Payload Object

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| cart      | object | Cart object obtained from your shop's platform. |

### Ref Object

| Parameter       | Type     | Description                                                                                                         |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| handleBackPress | function | Function for handling back press on Zephyr Checkout View, returns true if you are supposed to handle the backPress. |

### Example

```tsx
import React, { useRef } from 'react';
import {
  BackHandler, // Important //
  // Other UI related imports required for your app //
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import {
  Zephyr,
  ZephyrCheckoutSuccessEvent,
  ZephyrConfiguration,
  ZephyrEvent,
  ZephyrOnSuccessCallback,
  ZephyrOnCloseCallback,
  ZephyrOnErrorCallback,
  ZephyrOnErrorEvent,
  ZephyrOnEventCallback,
  ZephyrCallbacks,
  ZephyrRef
} from '@juspay/zephyr-sdk-react';

const zephyrConfig: ZephyrConfiguration = {
  merchantId: 'd2cstorebeta',
  shopUrl: 'https://d2c-store-beta.myshopify.com',
  shopPlatform: 'shopify',
  environment: 'production'
};

function App(): React.JSX.Element {
  // Reference to Zephyr SDK
  // Will be used for handling back press
  const zephyrRef = useRef<ZephyrRef>(null);

  // Defining callback handlers for Zephyr SDK

  const zephyrOnCheckoutSuccessCallback: ZephyrOnSuccessCallback = (
    r: ZephyrCheckoutSuccessEvent
  ) => {
    console.log('CheckoutSuccess! Order placed');
    // handle successful order placement here
    setShowCheckout(false);
  };

  const zephyrOnErrorCallback: ZephyrOnErrorCallback = (e: ZephyrOnErrorEvent) => {
    console.log('CheckoutError! Order failed');
    // handle error cases here
    console.error(e);
  };

  const zephyrOnCloseCallback: ZephyrOnCloseCallback = () => {
    // handle closure of checkout here
    setShowCheckout(false);
  };

  const zephyrOnEventCallback: ZephyrOnEventCallback = (e: ZephyrEvent) => {
    // handle events like hide-loader here
    console.log(e);
  };

  // Assembling the all callbacks into a single object
  const zephyrCallbacks: ZephyrCallbacks = {
    onComplete: zephyrOnCheckoutSuccessCallback,
    onError: zephyrOnErrorCallback,
    onClose: zephyrOnCloseCallback,
    onEvent: zephyrOnEventCallback
  };

  // Registering a hardware back press handler
  BackHandler.addEventListener('hardwareBackPress', () => {
    // Checking if Zephyr SDK will handle the back press or not
    const handleBackPress = zephyrRef.current?.handleBackPress();

    // If Zephyr SDK is handling the back press, we return false
    if (handleBackPress && showCheckout) {
      setShowCheckout(false);
      return false;
    }

    // If Zephyr SDK is not handling the back press, handle your back press logic here
    return true;
  });

  const handleBuyNowClick = () => {
    setShowCheckout(true);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={containerViewStyle}>
          <View style={productViewStyle}>
            // Your Product component here
            <Product buyNow={handleBuyNowClick} />
          </View>
          <View style={checkoutViewStyle}>
            {showCheckout && (
              // Calling Zephyr Checkout Component
              <Zephyr
                configuration={zephyrConfig}
                callbacks={zephyrCallbacks}
                checkoutPayload={{ cart: userCart }} // cart object obtained from your shop's platform
                ref={zephyrRef}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
```

### Additional Integration requirements

For allowing your app & Zephyr SDK to open UPI apps, you need to add following platform specific changes:

#### Android

##### Add the following to your `android/app/src/main/AndroidManifest.xml` file

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <queries>
    <intent>
      <data
        android:scheme="upi"
        android:pathPattern=".*"
        android:host="pay"
      />
    </intent>
    <intent>
      <data
        android:scheme="upi"
        android:pathPattern=".*"
        android:host="mandate"
      />
    </intent>
    <intent>
      <data
        android:scheme="upi"
        android:pathPattern=".*"
      />
    </intent>
  </queries>

  // Other manifest related code
</manifest>
```
