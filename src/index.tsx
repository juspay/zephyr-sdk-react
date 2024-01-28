import React, { forwardRef, useImperativeHandle } from 'react';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { safeParseJSON } from './utils';
import { isJSON } from 'type-decoder';
import type { ZephyrProps, ZephyrRef, ZephyrViewStyle } from './types';
import { Dimensions, Linking } from 'react-native';

export const Zephyr = forwardRef<ZephyrRef, ZephyrProps>((props: ZephyrProps, ref) => {
  let checkoutWebView: WebView | null;
  let isWebViewReady: boolean = false;
  let consumingBackPress: boolean = false;
  let pendingMessages: string[] = [];
  const appEndpoint: URL = new URL(
    props.configuration.environment === 'beta'
      ? 'https://app.beta.breeze.in'
      : 'https://app.breeze.in'
  );
  appEndpoint.searchParams.append('iplat', 'ReactNative');
  appEndpoint.searchParams.append('merchantId', props.configuration.merchantId);

  const windowDimensions = Dimensions.get('window');
  const webViewStyle: ZephyrViewStyle = props.style ?? {
    height: windowDimensions.height,
    width: windowDimensions.width
  };

  const sendMessageToWebView = (message: string) => {
    if (isWebViewReady && checkoutWebView !== null) {
      checkoutWebView.postMessage(message);
    } else {
      pendingMessages.push(message);
    }
  };

  const setPlatformData = {
    eventName: 'set-platform-store-data',
    shopUrl: props.configuration.shopUrl,
    platform: props.configuration.shopPlatform,
    offerCode: null,
    checkoutHidden: false,
    shopDomain: null
  };

  const setCartDataPayload = {
    eventName: 'set-cart-data',
    cart: props.checkoutPayload.cart
  };

  const startCheckoutPayload = {
    eventName: 'start-checkout'
  };

  sendMessageToWebView(JSON.stringify(setPlatformData));
  sendMessageToWebView(JSON.stringify(setCartDataPayload));
  sendMessageToWebView(JSON.stringify(startCheckoutPayload));

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    const parsedEventData = safeParseJSON(event.nativeEvent.data);
    if (isJSON(parsedEventData)) {
      const eventData = parsedEventData;
      const parsedEventPayload = safeParseJSON(eventData.payload);
      if (eventData === null) {
        return;
      }
      if (eventData.source === 'breeze') {
        if (eventData.message === 'app-ready') {
          isWebViewReady = true;
          flushPendingMessages();
        }
        if (eventData.message === 'consuming-back-press' && parsedEventPayload !== null) {
          consumingBackPress =
            typeof parsedEventPayload.consuming === 'boolean'
              ? parsedEventPayload.consuming
              : false;
        }
        if (eventData.message === 'checkout-complete') {
          const orderId =
            typeof parsedEventPayload?.orderId === 'string' ? parsedEventPayload?.orderId : '';
          const checkoutId =
            typeof parsedEventPayload?.checkoutId === 'string'
              ? parsedEventPayload?.checkoutId
              : '';
          const platformOrderId =
            typeof parsedEventPayload?.platformOrderId === 'string'
              ? parsedEventPayload?.platformOrderId
              : '';
          props.callbacks.onComplete({
            zephyrOrderId: orderId,
            zephyrCheckoutId: checkoutId,
            platformOrderId
          });
        }
        if (eventData.message === 'close-app') {
          props.callbacks.onClose();
        }

        if (eventData.message === 'hide-loader') {
          props.callbacks.onEvent({ eventName: 'hide-loader' });
        }

        if (eventData.message === 'error') {
          props.callbacks.onError({ error: 'error' });
        }

        if (eventData.message === 'open-app') {
          const intentUrl = parsedEventPayload?.url;
          if (typeof intentUrl === 'string') {
            const isIntentSupported = await Linking.canOpenURL(intentUrl);
            if (isIntentSupported) {
              await Linking.openURL(intentUrl);
            }
          }
        }
      }
    }
  };

  const flushPendingMessages = (): void => {
    pendingMessages.forEach((msg) => {
      sendMessageToWebView(msg);
    });
    pendingMessages = [];
  };

  useImperativeHandle(ref, () => ({
    handleBackPress: () => {
      if (consumingBackPress) {
        checkoutWebView?.goBack();
        return false;
      }
      return true;
    }
  }));

  return (
    <React.Fragment>
      <WebView
        ref={(webViewRef) => (checkoutWebView = webViewRef)}
        onMessage={handleWebViewMessage}
        originWhitelist={['*']}
        sharedCookiesEnabled={true}
        domStorageEnabled={true}
        source={{ uri: appEndpoint.href }}
        style={webViewStyle}
      />
    </React.Fragment>
  );
});

export * from './types';
