/**
 * @description Zephyr Configuration
 * @description Basic configuration required for starting 1 Click Checkout
 * @typedef {Object} ZephyrConfiguration
 * @property {string} merchantId - Zephyr Merchant ID
 * @property {string} shopUrl - Shop URL
 * @property {string} shopPlatform - Shop Platform
 * @property {string} environment - Zephyr Environment
 * @example
 * {
 * merchantId: 'zephyr-merchant-id',
 * shopUrl: 'https://shop-url.com',
 * shopPlatform: 'shopify',
 * environment: 'production'
 * }
 */
export type ZephyrConfiguration = {
  merchantId: string;
  shopUrl: string;
  shopPlatform: 'shopify';
  environment: ZephyrEnvironment;
};

/**
 * @description Zephyr Environment
 * @description Environment for running starting checkout. Always use `production` for production environment.
 */
export type ZephyrEnvironment = 'beta' | 'production';

/**
 * @description Zephyr Event
 * @description Event emitted by Zephyr SDK during the checkout journey
 * @typedef {Object} ZephyrEvent
 * @property {string} eventName - Name of the event
 * @property {Object} [eventData] - Event data
 * @example
 * {
 * eventName: 'hide-loader',
 * }
 */
export type ZephyrEvent = {
  eventName: string;
  eventData?: Record<string, unknown>;
};

/**
 * @description Zephyr On Event Callback
 * @description Callback for handling events emitted by Zephyr SDK
 * @typedef {function} ZephyrOnEventCallback
 * @param {ZephyrEvent} event - Event emitted by Zephyr SDK
 * @example
 * (event) => {
 * console.log(event);
 * }
 */
export type ZephyrOnEventCallback = (event: ZephyrEvent) => void;

/**
 * @description Zephyr Checkout Success Event
 * @description Event emitted by Zephyr SDK when checkout is successful
 * @typedef {Object} ZephyrCheckoutSuccessEvent
 * @property {string} zephyrOrderId - Zephyr Order ID
 * @property {string} zephyrCheckoutId - Zephyr Checkout ID
 * @property {string} platformOrderId - Platform Order ID
 * @example
 * {
 * zephyrOrderId: 'zephyr-order-id',
 * zephyrCheckoutId: 'zephyr-checkout-id',
 * platformOrderId: 'platform-order-id'
 * }
 */
export type ZephyrCheckoutSuccessEvent = {
  zephyrOrderId: string;
  zephyrCheckoutId: string;
  platformOrderId: string;
};

/**
 * @description Zephyr On Success Callback
 * @description Callback for handling successful checkout
 * @typedef {function} ZephyrOnSuccessCallback
 * @param {ZephyrCheckoutSuccessEvent} event - Event emitted by Zephyr SDK
 * @example
 * (event) => {
 * console.log(event);
 * }
 */
export type ZephyrOnSuccessCallback = (event: ZephyrCheckoutSuccessEvent) => void;

/**
 * @description Zephyr On Close Callback
 * @description Callback for handling close of Zephyr Checkout
 * @typedef {function} ZephyrOnCloseCallback
 * @example
 * () => {
 * console.log('Zephyr Checkout closed');
 * }
 */
export type ZephyrOnCloseCallback = () => void;

/**
 * @description Zephyr On Error Event
 * @description Event emitted by Zephyr SDK when error occurs during checkout
 * @typedef {Object} ZephyrOnErrorEvent
 * @property {string} error - Error code
 * @property {string} [message] - Error message
 * @example
 * {
 * error: 'error-code',
 * message: 'error-message'
 * }
 */
export type ZephyrOnErrorEvent = {
  error: string;
  message?: string;
};

/**
 * @description Zephyr On Error Callback
 * @description Callback for handling errors during checkout
 * @typedef {function} ZephyrOnErrorCallback
 * @param {Object} event - Event emitted by Zephyr SDK
 * @param {string} event.error - Error code
 * @param {string} [event.message] - Error message
 * @example
 * (event) => {
 * console.log(event);
 * }
 */
export type ZephyrOnErrorCallback = (event: ZephyrOnErrorEvent) => void;

/**
 * @description Zephyr Callbacks
 * @description Callbacks for handling events emitted by Zephyr SDK
 * @typedef {Object} ZephyrCallbacks
 * @property {function} onEvent - Callback for handling events emitted by Zephyr SDK
 * @property {function} onComplete - Callback for handling successful checkout
 * @property {function} onError - Callback for handling errors during checkout
 * @property {function} onClose - Callback for handling close of Zephyr Checkout
 * @example
 * {
 * onEvent: (event) => {
 *  console.log(event);
 * },
 * onComplete: (event) => {
 * console.log(event);
 * },
 * onError: (event) => {
 * console.log(event);
 * },
 * onClose: () => {
 * console.log('Zephyr Checkout closed');
 * }
 * }
 */
export type ZephyrCallbacks = {
  onEvent: ZephyrOnEventCallback;
  onComplete: ZephyrOnSuccessCallback;
  onError: ZephyrOnErrorCallback;
  onClose: ZephyrOnCloseCallback;
};

/**
 * @description Zephyr View Style
 * @description Style for Zephyr Checkout View
 * @typedef {Object} ZephyrViewStyle
 * @property {number} height - Height of Zephyr Checkout View
 * @property {number} width - Width of Zephyr Checkout View
 * @example
 * {
 * height: 500,
 * width: 500
 * }
 * @example
 * {
 * height: Dimensions.get('window').height,
 * width: Dimensions.get('window').width
 * }
 * @example
 * {
 * height: '100%',
 * width: '100%'
 * }
 */
export type ZephyrViewStyle = {
  height: number;
  width: number;
};

/**
 * @description Zephyr Start Checkout Payload
 * @description Payload for starting Zephyr Checkout
 * @description Cart object must be obtained from the platform
 * @typedef {Object} ZephyrStartCheckoutPayload
 * @property {Object} cart - Cart object
 * @example
 * {
 * cart: {
 * items: [
 * {
 * id: 'item-id',
 * name: 'item-name',
 * price: 100,
 * quantity: 1,
 * imageUrl: 'https://item-image-url.com',
 * url: 'https://item-url.com'
 * }
 * ],
 * currency: 'INR',
 * total: 100
 * }
 * }
 */
export type ZephyrStartCheckoutPayload = {
  cart: Record<string, unknown>;
};

/**
 * @description Zephyr Props
 * @description Props for Zephyr Checkout View
 * @typedef {Object} ZephyrProps
 * @property {ZephyrStartCheckoutPayload} checkoutPayload - Payload for starting Zephyr Checkout
 * @property {ZephyrConfiguration} configuration - Configuration for starting Zephyr Checkout
 * @property {ZephyrCallbacks} callbacks - Callbacks for handling events emitted by Zephyr SDK
 * @property {ZephyrViewStyle} [style] - Style for Zephyr Checkout View
 * @example
 * {
 * checkoutPayload: {
 * cart: {
 * items: [
 * {
 * id: 'item-id',
 * name: 'item-name',
 * price: 100,
 * quantity: 1,
 * imageUrl: 'https://item-image-url.com',
 * url: 'https://item-url.com'
 * }
 * ],
 * currency: 'INR',
 * total: 100
 * }
 * },
 * configuration: {
 *  merchantId: 'zephyr-merchant-id',
 *  shopUrl: 'https://shop-url.com',
 *  shopPlatform: 'shopify',
 *  environment: 'production'
 * },
 * callbacks: {
 * onEvent: (event) => {
 * console.log(event);
 * },
 * onComplete: (event) => {
 * console.log(event);
 * },
 * onError: (event) => {
 * console.log(event);
 * },
 * onClose: () => {
 * console.log('Zephyr Checkout closed');
 * }
 * },
 * style: {
 * height: 500,
 * width: 500
 * }
 * }
 */
export type ZephyrProps = {
  checkoutPayload: ZephyrStartCheckoutPayload;
  configuration: ZephyrConfiguration;
  callbacks: ZephyrCallbacks;
  style?: ZephyrViewStyle;
};

/**
 * @description Zephyr Ref
 * @description Ref for Zephyr Checkout View
 * @typedef {Object} ZephyrRef
 * @property {function} handleBackPress - Function for handling back press on Zephyr Checkout View, returns true if you are supposed to handle the backPress
 * @example
 * {
 * handleBackPress: () => {
 * console.log('Back pressed');
 * }
 * }
 */
export type ZephyrRef = {
  handleBackPress: () => boolean;
};
