js-joda Cheat sheet
=============================================

[For a detailed API Reference refer to the ESDoc generated docs](https://doc.esdoc.org/github.com/pithu/js-joda/)  

## Consistent method prefixes

The API is using a consistent method prefixes.

- of - static factory method
- parse - static factory method focused on parsing
- is - checks if something is true
- with - the immutable equivalent of a setter
- plus - adds an amount to an object
- minus - subtracts an amount from an object
- to - converts this object to another type
- at - combines this object with another, such as date.atTime(time)
- getter for instance properties are omitting the get keyword, e.q. localDate.year()  

## Basic concepts

The API is immutable, an existing instance is never changed, all manipulating methods as parse/ with/ plus/ minus/ to/ at are returning new instances.
An existing instance is always valid. Instead of returning null or invalid values, exceptions are thrown. 

## LocalDate

A LocalDate represents a date without a time and time-zone in the ISO-8601 calendar system, such as 2007-12-24.

### Create a LocalDate

```javascript

// obtain the current date in the system default timezone, e.g. 2016-02-23
LocalDate.now();

// obtain the current date in the utc timezone, e.g. 2016-02-23
LocalDate.now(Clock.systemUTC()); 

// obtain an instance of LocalDate from an ISO8601 formatted text string
LocalDate.parse('2016-02-23');

// obtain an instance of LocalDate from a year, month, and dayOfMonth value
LocalDate.of(2016, 2, 23) // 2016-02-23

// obtain an instance of LocalDate from a year, month, and dayOfMonth value
LocalDate.of(2016, Month.FEBRUARY, 23) // 2016-02-23

// obtain an instance of LocalDate from am epochDay where day 0 is 1970-01-01
LocalDate.ofEpochDay(-1) // 1969-12-31

// obtain an instance of LocalDate from am epochDay where day 0 is 1970-01-01
LocalDate.ofYearDay(2016, 42) // 2016-02-11

```

### Get values from LocalDate

```javascript

var d = LocalDate.parse('2016-12-24');

d.toString();   // '2016-12-24' ISO8601 format

d.dayOfMonth(); // 24
d.month();      // Month.DECEMBER
d.monthValue(); // 12
d.year();       // 2016

d.dayOfWeek();         // DayOfWeek.SATURDAY
d.dayOfWeek().value(); // 6
d.dayOfYear();         // 359

d.isLeapYear(); // true 2016 is a leap year
d.plusYears(1).isLeapYear() // false

// get the epoch day where 0 is 1970-01-01
d.toEpochDay(); // 17159

// get range of month
d.lengthOfMonth() // 31
d.range(ChronoField.DAY_OF_MONTH); // ValueRange(1 - 31)

// get range of year
d.lengthOfYear() // 366
d.range(ChronoField.DAY_OF_YEAR);  // ValueRange(1 - 366)

// get the day of week aligned to the first day of month
d.get(ChronoField.ALIGNED_DAY_OF_WEEK_IN_MONTH); // 3
d.withDayOfMonth(1).get(ChronoField.ALIGNED_DAY_OF_WEEK_IN_MONTH); // 1

```

### Adding to/ subtracting from a LocalDate
 
```javascript

var d = LocalDate.parse('2016-02-23');

// add/ subtract 366 days 
d.plusDays(366); // '2017-02-23'
d.minusDays(366); // '2015-02-22'

// add/ subtract 12 months 
d.plusMonths(12); // '2017-02-23'
d.minusMonths(12); // '2015-02-23'

// add/ subtract 4 weeks 
d.plusWeeks(4); // '2016-03-22'
d.minusWeeks(4); // '2016-01-26'

// add/ subtract 1 year to the parsed LocalDate and returns a new instance
d.plusYears(1); // '2017-02-23'
d.minusYears(1); // '2015-02-23'
 
// add/ subtract 30 years  
d.plus(3, ChronoUnit.DECADES); // '2046-02-23'
d.minus(3, ChronoUnit.DECADES); // '1986-02-23'

// add subtract a Period of 3 Months and 3 Days
d.plus(Period.ofMonths(3).plusDays(3))  // '2016-05-26'
d.minus(Period.ofMonths(3).plusDays(3)) // '2015-11-20'

```

### Alter certain fields of a LocalDate

```javascript

var d = LocalDate.parse('2016-12-24');

// set the day of month to 1
d.withDayOfMonth(1); // '2016-12-01'

// set month and the day of month to 1
d.withMonth(1).withDayOfMonth(1); // '2016-01-01'

// set month to November and the day of month to 1
d.withMonth(Month.NOVEMBER).withDayOfMonth(1); // '2016-11-01'

// set the year to beginning of era 
d.withYear(1); // '0001-12-24'

// get the last day of the current month
LocalDate.now().plusMonths(1).withDayOfMonth(1).minusDays(1);

// set the day of year
d.withDayOfYear(42); // 2016-02-11

// set the ALIGNED_WEEK_OF_YEAR to 51
d.with(ChronoField.ALIGNED_WEEK_OF_YEAR, 51) // 2016-12-17

// set by a TemporalAdjuster lastDayOfMonth
d.with(TemporalAdjusters.lastDayOfMonth()) // 2016-12-31

// set by a TemporalAdjuster lastDayOfMonth
d.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY)) // 2016-12-31

// set by a TemporalAdjuster next or same weekday
d.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)) // 2016-12-25

```

### Compare LocalDates

```javascript

var d1 = LocalDate.parse('2016-12-24');
var d2 = d1.plusDays(2);

d1.isAfter(d2);  // false
d1.isBefore(d2); // true

d1.equals(d2);   // false
d1.equals(d1.plusDays(0));   // true
d1.equals(d1.plusDays(1));   // false

d1.compareTo(d1) === 0; // true
d1.compareTo(d2) < 0;   // true
d2.compareTo(d1) > 0;   // true

d1.hashCode(); // 4129560
d2.hashCode(); // 4129562
d1.hashCode() !== d2.hashCode(); // true

```

### Distance on the timeline

```javascript

var d1 = LocalDate.parse('2016-12-24');
var d2 = d1.plusMonths(13).plusDays(42);

// obtain the Period between the two dates                     
d1.until(d2).toString();      // 'P1Y2M11D', output in ISO-8601 period format
d1.until(d2).toTotalMonths(); // 14

// obtain the distance between the two dates with a certain precision
d1.until(d2, ChronoUnit.MONTHS); // 14, returns the distance in total months.
d1.until(d2, ChronoUnit.DAYS); // 438, returns the distance in total days.

```

### Converting from and to other temporals

```javascript

// obtain a LocalDate from a LocalDateTime instance
LocalDate.from(LocalDateTime.now()); // current LocalDate e.g. 2016-02-25
LocalDateTime.now().toLocalDate(); // same

var d1 = LocalDate.parse('2016-02-25');

// obtain a LocalDateTime at a certain LocalTime
d1.atStartOfDay(); // '2016-02-25T00:00'
d1.atTime(LocalTime.of(11, 55)); // '2016-02-25T11:55'
d1.atTime(LocalTime.NOON); // '2016-02-25T12:00'

// TODO milestone 1
// add Basic ZoneDateTime and add a Converterhelper 
// obtain a LocalDate from an Instant
// Instant.now().atZone(ZoneId.systemDefault()).toLocalDate()

// obtain a LocalDate from a JavaScript Date
// var javascriptDate = new Date();
// Instant.ofEpochMilli(javascriptDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDate()

// obtaim a LocalDate from a moment
// var moment = moment();
// Instant.ofEpochMilli(moment.toDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDate()

```


## LocalTime

A LocalTime represents A time without time-zone in the ISO-8601 calendar system such as '10:15:30'

### Create a LocalTime instance

```javascript

// obtain the current time in the system default timezone, e.g. '10:29:05.743'
LocalTime.now();

// obtain the current time in the utc timezone, e.g. '09:29:05.743'
LocalTime.now(Clock.systemUTC()); 

// obtain an instance of LocalTime from an ISO8601 formatted text string
LocalTime.parse('09:42');      // '09:42'
LocalTime.parse('09:42:42');   // '09:42:42'
LocalTime.parse('09:42:42.123'); // '09:42:42.123'
LocalTime.parse('09:42:42.123456789'); // '09:42:42.123456789'

// obtain an instance of LocalDate from a hour, minute, second and nano value
LocalTime.of(23, 55) // '23:55'
LocalTime.of(23, 55, 42) // '23:55:42'
LocalTime.of(23, 55, 42, 123000000) // '23:55:42.123'


// obtain an instance of LoclTome from  second of day
LocalTime.ofSecondOfDay(3666) // '01:01:06'

```

### Get values from LocalTime

```javascript

var t = LocalTime.parse('23:55:42.123');

t.toString();   // '23:55:42.123' ISO8601 format

t.hour();   // 23
t.minute(); // 55
t.second(); // 42
t.nano();   // 123000000

// get other time based fields
t.get(ChronoField.SECOND_OF_DAY);   // 86142
t.get(ChronoField.MILLI_OF_SECOND);   // 123
t.get(ChronoField.HOUR_OF_AMPM);      // 11
// any other time based ChronoField is allowed as param for get

```

### Adding to/ subtracting from a LocalTime instance
 
```javascript

var t = LocalTime.parse('11:55:42')

// add/ subtract 12 hours 
t.plusHours(12); // '23:55:42'
t.minusHours(12); // '23:55:42'

// add/ subtract 30 minutes 
t.plusMinutes(30); // '12:25:42'
t.minusMinutes(30); // '11:25:42'

// add/ subtract 30 minutes 
t.plusSeconds(30); // '11:56:12'
t.minusSeconds(30); // '11:55:12'

// add/ subtract 1.000.000 nanos (1 milli second) 
t.plusNanos(1000000); // '11:56:42.001'
t.minusNanos(1000000); // '11:55:41.999'

// add/ subtract a time based unit
t.plus(1, ChronoUnit.MILLIS); // '11:55:42.001'
t.plus(1, ChronoUnit.HALF_DAYS); // '23:55:42'

// add/ subtract a duration of 15 minutes
t.plus(Duration.ofMinutes(15)); // '12:10:42'
t.minus(Duration.ofMinutes(15)); // '11:40:42'

```

### Alter certain fields of a LocalTime instance

```javascript

var t = LocalTime.parse('11:55:42')

// set the hour of day to 1
t.withHour(1); // '01:55:42'

// set the minute of hour to 1
t.withMinute(1); // '11:01:42'

// set the second of minute to 1
t.withSecond(1); // '11:55:01'

// set the MILLI_OF_SECOND to 51
t.with(ChronoField.MILLI_OF_SECOND, 51) // '11:55:42.051'

// set by a custom  TemporalAdjusters
// sample of a custom adjuster that adjust to the next even second
nextEvenSecond = { adjustInto: function(t){ return t.second() % 2 === 0 ? t.plusSeconds(2) : t.plusSeconds(1); } }
t.with(nextEvenSecond) // '11:55:44'
t.plusSeconds(1).with(nextEvenSecond) // '11:55:44'

```

### truncate a LocalTime instance

```javascript

var t = LocalTime.parse('23:55:42.123')

t.truncatedTo(ChronoUnit.SECONDS); // '23:55:42'
t.truncatedTo(ChronoUnit.MINUTES); // '23:55:00'
t.truncatedTo(ChronoUnit.HOURS);   // '23:00'
t.truncatedTo(ChronoUnit.HALF_DAYS); // '12:00'
t.truncatedTo(ChronoUnit.DAYS);      // '00:00'

```

### Compare LocalTime instances

```javascript

var t1 = LocalTime.parse('11:55:42')
var t2 = t1.plusHours(2);

t1.isAfter(t2);  // false
t1.isBefore(t2); // true

t1.equals(t1.plusHours(0));   // true
t1.equals(t1.plusHours(1));   // false

t1.compareTo(t1) === 0; // true
t1.compareTo(t2) < 0;   // true
t2.compareTo(t1) > 0;   // true

t1.hashCode(); // 916974646
t2.hashCode(); // -1743180648
t1.hashCode() !== t2.hashCode(); // true

```

### Distance between times 

```javascript

var t1 = LocalTime.parse('11:00')
var t2 = t1.plusHours(2).plusMinutes(42).plusSeconds(12);

// obtain the duration between the two dates                     
t1.until(t2, ChronoUnit.HOURS);    // 2
t1.until(t2, ChronoUnit.MINUTES);  // 162
t1.until(t2, ChronoUnit.SECONDS);  // 9732

```


