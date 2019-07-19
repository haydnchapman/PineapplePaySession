//Script that requires insertion into page
const main = () => {
    class ApplePaySession {
        constructor(version, paymentRequest) {
            this.version = version;
            this.paymentRequest = paymentRequest;
        }
    
        static supportsVersion(versionNumber) {
            return true;
        }
    
        static canMakePayments() {
            return true;
        }

       static canMakePaymentsWithActiveCard() {
            return Promise.resolve(this.canMakePayments());
        }

        static STATUS_SUCCESS = "SUCCESS";

        completeMerchantValidation(response){
            console.log('completeMerchantValidation', response);
            
            const mockPaymentData = {
                version: "mock_v1",
                data: "mockData",
                sigature: "mockSignature",
                header: {
                    ephemeralPublicKey: "mockPublicKey",
                    publicKeyHash: "mockPublicKeyHash",
                    transactionId: "mockTransactionId"
                }
            }

            const event = {
                payment: {
                    token:{
                       paymentData: mockPaymentData
                    }
                }
            };

            this.onpaymentauthorized(event, this);
        }

        completePayment(authorizationResult){
            console.log('Payment Completed', authorizationResult);
        }

        begin() {
            let errors = [];

            if(!this.onvalidatemerchant || typeof(this.onvalidatemerchant) !== 'function')
                errors.push('onvalidatemerchant has not been implemented'); 
            
            if(!this.onpaymentauthorized || typeof(this.onpaymentauthorized)  !== 'function')
                errors.push('onpaymentauthorized has not been implemented');
            
            if(errors.length > 0){
                errors.map(error => console.log(error));
                return;
            }

            const event = {
                validationURL: "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession"
            };

            this.onvalidatemerchant(event, this);
        }
    }
    
    window.ApplePaySession = ApplePaySession;
}

// Handle the insertion of script and instant execution 
const wrapFunction = (injectedFunction) => {
    return '(' + injectedFunction + ')();';
}

const injectScript = () => {
    var script = document.createElement('script');
    script.textContent = wrapFunction(main);
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

injectScript();