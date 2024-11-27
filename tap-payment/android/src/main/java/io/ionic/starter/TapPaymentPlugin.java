package com.example.tappayment;

import android.app.Activity;
import androidx.annotation.NonNull;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;
import company.tap.gosellapi.GoSellSDK;
import company.tap.gosellapi.internal.api.models.Charge;
import company.tap.gosellapi.models.TransactionMode;

@CapacitorPlugin(name = "TapPayment")
public class TapPaymentPlugin extends Plugin {

    @PluginMethod
    public void startPayment(PluginCall call) {
        // Extract payment parameters
        double amount = call.getDouble("amount");
        String currency = call.getString("currency");

        // Initialize the TAP SDK
        GoSellSDK.init(getContext(), "sk_test_ParN2MZDGgdbkqLcmIuznVTH", SDKMode.SANDBOX); // Change to SDKMode.PRODUCTION for live

        // Set up the payment request
        GoSellSDK.getInstance().setTransactionMode(TransactionMode.PURCHASE)
                .setAmount(amount)
                .setCurrency(currency)
                .startPayment(getActivity(), new GoSellSDK.PaymentCallback() {
                    @Override
                    public void onSuccess(@NonNull Charge charge) {
                        call.resolve();
                    }

                    @Override
                    public void onFailure() {
                        call.reject("Payment failed");
                    }
                });
    }
}
\