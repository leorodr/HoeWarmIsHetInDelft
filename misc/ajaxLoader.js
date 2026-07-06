// ------------------------------------------------------------------------------------------
//  main function.. read clientraw.txt and format <span class="ajax" id="ajax..."></span> areas
// ------------------------------------------------------------------------------------------
function ajaxLoader(url) {
  if (document.getElementById) {
    var x = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest(url);
  }
  if (x) { // got something back
    x.onreadystatechange = function() {
    try { if (x.readyState == 4 && x.status == 200) { // Mike Challis added fix to fix random error: NS_ERROR_NOT_AVAILABLE 
    var clientraw = x.responseText.split(' ');
	// now make sure we got the entire clientraw.txt  -- thanks to Johnnywx
	// valid clientraw.txt has '12345' at start and '!!' at end of record
	var wdpattern=/\d+\.\d+.*!!/; // looks for '!!nn.nn!!' version string 
	// If we have a valid clientraw file AND updates is < maxupdates
	if(clientraw[0] == '12345' && wdpattern.test(x.responseText) && 
	    ( updates <= maxupdates || maxupdates > 0  ) ) {
		if (maxupdates > 0 ) {updates++; } // increment counter if needed

		//Temperature
		temp = convertTemp(clientraw[4]);
		set_ajax_obs("ajaxtemp", temp.toFixed(1) + uomTemp);
		set_ajax_obs("ajaxtempNoU", temp.toFixed(1));
		set_ajax_obs("gizmotemp", temp.toFixed(1) + uomTemp);
		set_ajax_obs("ajaxbigtemp",temp.toFixed(0) + uomTemp);

		templast = convertTemp(clientraw[90]);
		temparrow = ajax_genarrow(temp, templast, '', 
			 langTempRising+uomTemp+langTempLastHour,
			 langTempFalling+uomTemp+langTempLastHour,1)
		
		set_ajax_obs("ajaxtemparrow",temparrow); 
		set_ajax_obs("gizmotemparrow",temparrow); 
		   
	    temprate = temp - templast;
		temprate = temprate.toFixed(1);
		if (temprate > 0.0) { temprate = '+' + temprate;} // add '+' for positive rates
		set_ajax_obs("ajaxtemprate",temprate + uomTemp);
		set_ajax_obs("gizmotemprate",temprate + uomTemp);

		tempmax = convertTemp(clientraw[46]);
		set_ajax_obs("ajaxtempmax",tempmax.toFixed(1) + uomTemp);

		tempmin = convertTemp(clientraw[47]);
		set_ajax_obs("ajaxtempmin",tempmin.toFixed(1) + uomTemp);
		
		thermometerstr = langThermoCurrently +  + temp.toFixed(1) + uomTemp + 
		  ", " + langThermoMax + tempmax.toFixed(1) + uomTemp +
		  ", " + langThermoMin + tempmin.toFixed(1) + uomTemp;

		set_ajax_obs("ajaxthermometer",
			"<img src=\"" + thermometer + "?t=" + temp.toFixed(1) + "\" " +
				"width=\"54\" height=\"170\" " +
				"alt=\"" + thermometerstr + "\" " +
				"title=\"" + thermometerstr + "\" />" );

		//Humidity ...
		humidity = clientraw[5];
		set_ajax_obs("ajaxhumidity",humidity);
		set_ajax_obs("gizmohumidity",humidity);
		// sorry.. no min/max data for humidity available in clientraw.txt
		
		//Dewpoint ...
		dew = convertTemp(clientraw[72]);
		set_ajax_obs("ajaxdew",dew.toFixed(1) + uomTemp);
		set_ajax_obs("gizmodew",dew.toFixed(1) + uomTemp);
		dewmin = convertTemp(clientraw[139]);
		set_ajax_obs("ajaxdewmin",dewmin.toFixed(1) + uomTemp);
		dewmax = convertTemp(clientraw[138]);
		set_ajax_obs("ajaxdewmax",dewmax.toFixed(1) + uomTemp);

		// Humidex
		humidex = convertTemp(clientraw[45]);
		set_ajax_obs("ajaxhumidex",humidex.toFixed(1) + uomTemp);
		humidexmin = convertTemp(clientraw[76]);
		set_ajax_obs("ajaxhumidexmin",humidexmin.toFixed(1) + uomTemp);
		humidexmax = convertTemp(clientraw[75]);
		set_ajax_obs("ajaxhumidexmax",humidexmax.toFixed(1) + uomTemp);

		//  WindChill
		windchill = convertTemp(clientraw[44]);
		set_ajax_obs("ajaxwindchill",windchill.toFixed(1) + uomTemp);
		windchillmin = convertTemp(clientraw[78]);
		set_ajax_obs("ajaxwindchillmin",windchillmin.toFixed(1) + uomTemp);
		windchillmax = convertTemp(clientraw[77]);
		set_ajax_obs("ajaxwindchillmax",windchillmax.toFixed(1) + uomTemp);

		// Heat Index
		heatidx = convertTemp(clientraw[112]);
		set_ajax_obs("ajaxheatidx",heatidx.toFixed(1) + uomTemp);
		heatidxmin = convertTemp(clientraw[111]);
		set_ajax_obs("ajaxheatidxmin",heatidxmin.toFixed(1) + uomTemp);
		heatidxmax = convertTemp(clientraw[110]);
		set_ajax_obs("ajaxheatidxmax",heatidxmax.toFixed(1) + uomTemp);

		// FeelsLike
		temp = clientraw[4]; // note.. temp in C
        if (temp <= 16.0 ) {
		  feelslike = clientraw[44]; //use WindChill
		} else if (temp >=27.0) {
		  feelslike = clientraw[45]; //use Humidex
		} else {
		  feelslike = temp;   // use temperature
		}
		feelslike  = Math.round(convertTemp(feelslike));
        set_ajax_obs("ajaxfeelslike",feelslike + uomTemp);

		// # mike challis added heatColorWord feature
		var heatColorWord = heatColor(clientraw[4],clientraw[44],clientraw[45]);
		set_ajax_obs("ajaxheatcolorword",heatColorWord);
		
		// Apparent temperature
		apparenttemp = convertTemp(clientraw[130]);
		set_ajax_obs("ajaxapparenttemp",apparenttemp.toFixed(1) + uomTemp);
		apparenttempmin = convertTemp(clientraw[136]);
		set_ajax_obs("ajaxapparenttempmin",apparenttempmin.toFixed(1) + uomTemp);
		apparenttempmax = convertTemp(clientraw[137]);
		set_ajax_obs("ajaxapparenttempmax",apparenttempmax.toFixed(1) + uomTemp);
		
		//Pressure...
		pressure = convertBaro(clientraw[6]);
		set_ajax_obs("ajaxbaro",pressure.toFixed(dpBaro) + uomBaro);
		set_ajax_obs("ajaxbaroNoU",pressure.toFixed(dpBaro));
		set_ajax_obs("gizmobaro",pressure.toFixed(dpBaro) + uomBaro);
		pressuretrend = convertBaro(clientraw[50]);
		pressuretrend = pressuretrend.toFixed(dpBaro+1);
		if (pressuretrend > 0.0) {pressuretrend = '+' + pressuretrend; } // add '+' to rate
		set_ajax_obs("ajaxbarotrend",pressuretrend + uomBaro);
		set_ajax_obs("gizmobarotrend",pressuretrend + uomBaro);
		set_ajax_obs("ajaxbaroarrow",
		   ajax_genarrow(pressure, pressure-pressuretrend, '', 
			 langBaroRising+uomBaro+langBaroPerHour,
			 langBaroFalling+uomBaro+langBaroPerHour,2)
			 );	
		barotrendtext = ajax_get_barotrend(clientraw[50]);
		set_ajax_obs("ajaxbarotrendtext",barotrendtext);
		set_ajax_obs("gizmobarotrendtext",barotrendtext);

		pressuremin = convertBaro(clientraw[132]);
		set_ajax_obs("ajaxbaromin",pressuremin.toFixed(dpBaro) + uomBaro);
		pressuremax = convertBaro(clientraw[131]);
		set_ajax_obs("ajaxbaromax",pressuremax.toFixed(dpBaro) + uomBaro);

        //Wind gust
		gust    = convertWind(clientraw[140]);
		maxgust = convertWind(clientraw[71]);
		if (maxgust > 0.0 ) {
		  set_ajax_obs("ajaxmaxgust",maxgust.toFixed(1) + uomWind);
		} else {
		  set_ajax_obs("ajaxmaxgust",'None');
		}

		//Windspeed ...
		wind = convertWind(clientraw[2]);
		beaufortnum = ajax_get_beaufort_number(clientraw[2]);
		set_ajax_obs("ajaxbeaufortnum",beaufortnum);
		set_ajax_obs("ajaxbeaufort",langBeaufort[beaufortnum]);

       //WIND DIRECTION ...
        val = windDir(clientraw[3]);
		valLang = windDirLang(clientraw[3]); /* to enable translations */

       if (wind > 0.0) {
		set_ajax_obs("ajaxwind",wind.toFixed(1) + uomWind);
		set_ajax_obs("ajaxwindNoU",wind.toFixed(1));
		set_ajax_obs("gizmowind",wind.toFixed(1) + uomWind);
		set_ajax_uom("ajaxwinduom",true);
	   } else {
		set_ajax_obs("ajaxwind",langWindCalm);
		set_ajax_obs("ajaxwindNoU",langWindCalm);
		set_ajax_obs("gizmowind",langWindCalm);
		set_ajax_uom("ajaxwinduom",false);
	   }
	   
	   if (gust > 0.0) {
		set_ajax_obs("ajaxgust",gust.toFixed(1) + uomWind);
		set_ajax_obs("ajaxgustNoU",gust.toFixed(1));
		set_ajax_obs("gizmogust",gust.toFixed(1) + uomWind);
		set_ajax_uom("ajaxgustuom",true);
	   } else {
		set_ajax_obs("ajaxgust",langGustNone);
		set_ajax_obs("ajaxgustNoU",langGustNone);
		set_ajax_obs("gizmogust",langGustNone);
		set_ajax_uom("ajaxgustuom",false);
	   }
	   
   	   if (gust > 0.0 || wind > 0.0) {
		windicon = 	"<img src=\"" + imagedir + "/" +  val + ".gif\" width=\"14\" height=\"14\" alt=\"" + 
		  langWindFrom + valLang + "\" title=\"" + langWindFrom + valLang + "\" /> ";
 		set_ajax_obs("ajaxwindicon",windicon);
		set_ajax_obs("gizmowindicon",windicon);
 		set_ajax_obs("ajaxwindiconwr",
		  "<img src=\"" + imagedir + "/" +wrName +  val + wrType + "\" width=\""+
		   wrWidth+"\" height=\""+wrHeight+"\" alt=\"" + 
		  langWindFrom + valLang + "\" title=\"" +langWindFrom + valLang + "\" /> ");
		set_ajax_obs("ajaxwinddir",valLang);
		set_ajax_obs("gizmowinddir",valLang);
	   } else {
 		set_ajax_obs("ajaxwindicon","");
 		set_ajax_obs("gizmowindicon","");
		set_ajax_obs("ajaxwinddir","");
		set_ajax_obs("gizmowinddir","");
		if (wrCalm != '') {
 		 set_ajax_obs("ajaxwindiconwr",
		  "<img src=\"" + imagedir + "/" + wrCalm + "\" width=\""+
		   wrWidth+"\" height=\""+wrHeight+"\" alt=\"" + 
		  langBeaufort[0] + "\" title=\"" +langBeaufort[0] + "\" /> ");
		}
	   }

		windmaxavg = convertWind(clientraw[113]);
		set_ajax_obs("ajaxwindmaxavg",windmaxavg.toFixed(1) + uomWind);
		
		windmaxgust = convertWind(clientraw[71]);
		set_ajax_obs("ajaxwindmaxgust",windmaxgust.toFixed(1) + uomWind);

		windmaxgusttime = clientraw[135];
		windmaxgusttime = windmaxgusttime.toLowerCase();
		windmaxgusttime = windmaxgusttime.replace( "_" , "");
		set_ajax_obs("ajaxwindmaxgusttime",windmaxgusttime);
		

		//  Solar Radiation
		solar    = clientraw[127] * 1.0;
		set_ajax_obs("ajaxsolar",solar.toFixed(0));

        solarpct = clientraw[34];
		set_ajax_obs("ajaxsolarpct",solarpct);
		
		// UV Index		
		uv       = clientraw[79];
		set_ajax_obs("ajaxuv",uv) ;
		set_ajax_obs("gizmouv",uv) ;

		uvword = ajax_getUVrange(uv);
		set_ajax_obs("ajaxuvword",uvword);
		set_ajax_obs("gizmouvword",uvword);

		//Rain ...
		rain = convertRain(clientraw[7]);
		set_ajax_obs("ajaxrain",rain.toFixed(dpRain) + uomRain);
		set_ajax_obs("ajaxrainNoU",rain.toFixed(dpRain));
		set_ajax_obs("gizmorain",rain.toFixed(dpRain) + uomRain);

		rainydy = convertRain(clientraw[19]);
		set_ajax_obs("ajaxrainydy",rainydy.toFixed(dpRain)+ uomRain);

		rainmo = convertRain(clientraw[8]);
		set_ajax_obs("ajaxrainmo",rainmo.toFixed(dpRain) + uomRain);

		rainyr = convertRain(clientraw[9]);
		set_ajax_obs("ajaxrainyr",rainyr.toFixed(dpRain) + uomRain);

		rainratehr = convertRain(clientraw[10]) * 60; // make per hour rate.
		set_ajax_obs("ajaxrainratehr",rainratehr.toFixed(dpRain+1) + uomRain);

		rainratemax = convertRain(clientraw[11]) * 60; // make per hour rate
		set_ajax_obs("ajaxrainratemax",rainratemax.toFixed(dpRain+1) + uomRain);

		// Provides Date String Objects in the form of
		// ntime = HH:MM                as in 17:24
		// ndate = Mon DD, YYYY         as in Nov 14, 2007
		// tday  = 3 letter Abr of Day  as in Wed
		//
		// All combined you could end up with   Mon Nov 14, 2007
		// 
		// Uses clientraw elements:
		// Hour 29  Min 30  Day 35  Month 36  Year 141
		// Added 2007-11-14 by Kevin Reed TNETWeather.com
		//======================================================================
		ntime = clientraw[29] + ":" + clientraw[30];
		ndate = langMonths[ clientraw[36] -1 ].substring(0,3) + " " + clientraw[35] + " " + clientraw[141];
		ndate2 = clientraw[35] + "-" +langMonths[ clientraw[36] -1 ].substring(0,3) + "-" +  clientraw[141];
		myDate = new Date( langMonths[ clientraw[36] - 1 ] + " " + clientraw[35] + ", " + clientraw[141] );
		tday = langDays[myDate.getDay()];
		//
		set_ajax_obs("ajaxndate", ndate );
		set_ajax_obs("ajaxndate2",ndate2);
		set_ajax_obs("ajaxntime", ntime );
		set_ajax_obs("ajaxntimess", ntime + ":" + clientraw[31]);
		set_ajax_obs("ajaxdname", tday );

		// current date and time of observation in clientraw.txt
		ajaxtimeformat = clientraw[32];
		ajaxdateformat = clientraw[74];
		ajaxtimeformat = ajaxtimeformat.split('-')[1];
		ajaxtimeformat = ajaxtimeformat.replace( "_" , "");
		ajaxtimeformat = ajaxtimeformat.toLowerCase();

		set_ajax_obs("ajaxdatetime",ajaxdateformat + " " +ajaxtimeformat);
		set_ajax_obs("ajaxdate",ajaxdateformat);
		set_ajax_obs("ajaxtime",ajaxtimeformat);
		set_ajax_obs("gizmodate",ajaxdateformat);
		set_ajax_obs("gizmotime",ajaxtimeformat);
		
		if (lastajaxtimeformat != ajaxtimeformat) {
			counterSecs = 0;                      // reset timer
			lastajaxtimeformat = ajaxtimeformat; // remember this time
		}
		
		// current condition icon and description
		set_ajax_obs("ajaxconditionicon",
			ajax_wxIcon(clientraw[48])
			);

		set_ajax_obs("ajaxconditionicon2",
			ajax_wxIconJPG(clientraw[48])
			);


		currentcond = clientraw[49];
//		currentcond = currentcond.replace(/_/g,' ');
//		currentcond = currentcond.replace(/^\/Dry\//g,'');
		currentcond = currentcond.replace(/\\/g,', ');
//		currentcond = currentcond.replace(/\//g,', ');
        currentcond = ajaxFixupCondition(currentcond);
		set_ajax_obs("ajaxcurrentcond",currentcond);
		set_ajax_obs("gizmocurrentcond",currentcond);
		
		// cloud height
		cloudheight = clientraw[73];
		set_ajax_obs("ajaxcloudheight",convertHeight(cloudheight) + uomHeight);
		
		// now ensure that the indicator flashes on every AJAX fetch
        var element = document.getElementById("ajaxindicator");
		if (element) {
          element.style.color = flashcolor;
		}
        var element = document.getElementById("gizmoindicator"); // separate gizmo ajax variable
		if (element) {
          element.style.color = flashcolor;
		}
		if (maxupdates > 0 && updates > maxupdates-1) { /* chg indicator to pause message */
			set_ajax_obs("ajaxindicator",langPauseMsg);
		}
		set_ajax_obs('ajaxupdatecount',updates);       /* for test pages */
		set_ajax_obs('ajaxmaxupdatecount',maxupdates); /* for test pages */

 	  } // END if(clientraw[0] = '12345' and '!!' at end)

	 } // END if (x.readyState == 4 && x.status == 200)

    } // END try

   	catch(e){}  // Mike Challis added fix to fix random error: NS_ERROR_NOT_AVAILABLE

    } // END x.onreadystatechange = function() {
    x.open("GET", url, true);
    x.send(null);

//  reset the flash colors, and restart the update unless maxupdate limit is reached

    setTimeout("reset_ajax_color('')",flashtime); // change text back to default color 

	if ( (maxupdates == 0) || (updates < maxupdates-1)) {
      setTimeout("ajaxLoader(clientrawFile + '?' + new Date().getTime())", reloadTime); // get new data 
    }
  }
} // end ajaxLoader function
