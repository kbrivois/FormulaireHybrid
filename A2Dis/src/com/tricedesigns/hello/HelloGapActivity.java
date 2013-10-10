package com.tricedesigns.hello;

import com.tricedesigns.hello.R;

import android.os.Bundle;
import android.view.Menu;

import org.apache.cordova.DroidGap;

public class HelloGapActivity extends DroidGap {

    @Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/html/index.html");
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
}
