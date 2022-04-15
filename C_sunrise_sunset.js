// --- CalculateSunriseOrSunset ---
///* w  w w . j  a v a 2s .co m*/
// Calculates the time of sunrise or sunset at a given location on a given day.
//
// Parameters
//    latitude - latitude in degrees of location
//   longitude - longitude in degrees of location
//        date - Date object - day to calculate
//     sunrise - Boolean - whether to calculate sunrise (true) or sunset (false)
//    twilight - Boolean - whether to calculate twilight (true) or sunrise/sunset (false)
//
// Returns
//   floating-point hour of sun event in UTC
//     (e.g., 5.15 => 0509Z), or null if the event doesn't occur on the given day
//

 var floor = Math.floor,
        degtorad = function(deg) {
            return Math.PI * deg / 180;
        },
        radtodeg = function(rad) {
            return 180 * rad / Math.PI;
        },
        sin = function(deg) {
            return Math.sin(degtorad(deg));
        },
        cos = function(deg) {
            return Math.cos(degtorad(deg));
        },
        tan = function(deg) {
            return Math.tan(degtorad(deg));
        },
        asin = function(x) {
            return radtodeg(Math.asin(x));
        },
        acos = function(x) {
            return radtodeg(Math.acos(x));
        },
        atan = function(x) {
            return radtodeg(Math.atan(x));
        },
        modpos = function(x, m) {
            return ((x % m) + m) % m;
        };


function CalculateSunriseOrSunset(geo, date, sunrise, twilight)
{
  // Source:
  //   Almanac for Computers, 1990
  //   published by Nautical Almanac Office
  //   United States Naval Observatory
  //   Washington, DC 20392

  day   = date.getDate();
  month = date.getMonth() + 1;
  year  = date.getFullYear();

  var zenith;

  if (twilight)
  {
      zenith = 99;
  }
  else
      zenith = 90.8333333333;


  // Calculate the day of the year.

  N1 = Math.floor(275.0 * month / 9.0);
  N2 = Math.floor((month + 9.0) / 12.0);
  N3 = 1.0 + Math.floor((year - 4.0 * Math.floor(year / 4.0) + 2.0) / 3.0);
  N = N1 - (N2 * N3) + day - 30.0;


  // Convert the longitude to hour value and calculate an approximate time.

  lngHour = geo.long / 15.0;

  if (sunrise)
      t = N + ((6.0 - lngHour) / 24.0);
  else
      t = N + ((18.0 - lngHour) / 24.0)


  // Calculate the sun's mean anomaly.

  M = (0.9856 * t) - 3.289;


  // Calculate the sun's true longitude.

  //L = M + (1.916 * sinD(M)) + (0.020 * sinD(2 * M)) + 282.634;
  L = M + (1.916 * sin(M)) + (0.020 * sin(2 * M)) + 282.634;

  while (L >= 360) L -= 360.0;
  while (L <  0)   L += 360.0;


  // Caculate the sun's right ascension.

  RA = atan(0.91764 * tan(L));

  while (RA >= 360) RA -= 360.0;
  while (RA <  0)   RA += 360.0;


  // Right ascension value needs to be in the same quadrant as L.

  Lquadrant = Math.floor(L / 90.0) * 90.0;
  RAquadrant = Math.floor(RA / 90.0) * 90.0;
  RA = RA + (Lquadrant - RAquadrant);


  // Right ascension value needs to be converted into hours.

  RA /= 15.0;


  // Calculate the sun's declination.

  var sinDec = 0.39782 * sin(L),
  		cosDec = cos(asin(sinDec));


  // Calculate the sun's local hour angle.

  var cosH = (cos(zenith) - (sinDec * sin(geo.lat))) / (cosDec * cos(geo.lat));

  if (sunrise)
  {
      if (cosH > 1) return null;
  }
  else
  {
      if (cosH < -1) return null;
  }


  // Finish calculating H and convert into hours.

  if (sunrise)
      H = 360.0 - acos(cosH);
  else
      H = acos(cosH);

  H /= 15.0


  // Calculate local mean time of rising.

  T = H + RA - (0.06571 * t) - 6.622;


  // Adjust back to UTC.

  UT = T - lngHour;

  // remove me
  UT += Math.ceil(geo.long / 15);

  while (UT >= 24) UT -= 24.0;
  while (UT <  0)  UT += 24.0;

  return UT;
}


function timeToAngle(time){
  var r = ((time / 24) * twoPi);
  return r;

}

// Parameters
//    latitude - latitude in degrees of location
//   longitude - longitude in degrees of location

//        date - Date object - day to calculate
//     sunrise - Boolean - whether to calculate sunrise (true) or sunset (false)
//    twilight - Boolean - whether to calculate twilight (true) or sunrise/sunset (false)

const ll = {lat:-34.02022319398916, long:24.9233533638718}
const today = new Date();

const sunRise = CalculateSunriseOrSunset(ll, today, true, false)
console.log('sunrise today at : '+sunRise)

const sunSet = CalculateSunriseOrSunset(ll, today, false, false)
console.log('sunset today at : '+sunSet)

