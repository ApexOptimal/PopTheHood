/**
 * Production-safe logger.
 * In __DEV__: all calls forward to console.
 * In production: log/warn are no-ops; errors are captured by Sentry.
 */
const noop = () => {};

let captureException = noop;
let captureMessage = noop;

try {
  const Sentry = require('@sentry/react-native');
  captureException = Sentry.captureException;
  captureMessage = (msg) => Sentry.captureMessage(msg, 'warning');
} catch (_) {
  // Sentry not available
}

const logger = __DEV__
  ? {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
    }
  : {
      log: noop,
      warn: noop,
      error: (...args) => {
        const err = args[0] instanceof Error ? args[0] : new Error(args.map(String).join(' '));
        captureException(err);
      },
    };

export default logger;
