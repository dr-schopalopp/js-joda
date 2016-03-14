/*
 * @copyright (c) 2016, Philipp Thuerwaechter & Pattrick Hueper
 * @copyright (c) 2007-present, Stephen Colebourne & Michael Nascimento Santos
 * @license BSD-3-Clause (see LICENSE in the root directory of this source tree)
 */

import '../_init';

// import {expect} from 'chai';
import {assertEquals, assertTrue} from '../testUtils';
import {isCoverageTestRunner, isBrowserTestRunner} from '../testUtils';

// import {NullPointerException} from '../../src/errors';

import {Clock} from '../../src/Clock';
import {Instant} from '../../src/Instant';
import {LocalTime} from '../../src/LocalTime';
import {LocalDateTime} from '../../src/LocalDateTime';
import {Month} from '../../src/Month';
import {MathUtil} from '../../src/MathUtil';
import {ZonedDateTime} from '../../src/ZonedDateTime';
import {ZoneId} from '../../src/ZoneId';
import {ZoneOffset} from '../../src/ZoneOffset';

describe('org.threeten.bp.TestZonedDateTime', () => {
    
    describe('now()', () => {
   
        it('now()', () => {
            var expected = ZonedDateTime.now(Clock.systemDefaultZone());
            var test = ZonedDateTime.now();
            var diff = Math.abs(test.toLocalTime().toNanoOfDay() - expected.toLocalTime().toNanoOfDay());
            if (diff >= 100000000) {
                // may be date change
                expected = ZonedDateTime.now(Clock.systemDefaultZone());
                test = ZonedDateTime.now();
                diff = Math.abs(test.toLocalTime().toNanoOfDay() - expected.toLocalTime().toNanoOfDay());
            }
            assertTrue(diff < 100000000);  // less than 0.1 secs
        });
        
    });
   
   
    describe('now(ZoneId)', () => {
        
        it('now_ZoneId', function () {
            var zone = ZoneId.systemDefault();
            var expected = ZonedDateTime.now(Clock.system(zone));
            var test = ZonedDateTime.now(zone);
            for (var i = 0; i < 100; i++) {
                if (expected.equals(test)) {
                    return;
                }
                expected = ZonedDateTime.now(Clock.system(zone));
                test = ZonedDateTime.now(zone);
            }
            assertEquals(test, expected);
            
        });

    });

    describe('now(Clock)', () => {

        var diff = isCoverageTestRunner() || isBrowserTestRunner ? 179 : 7;
        it('now_Clock_allSecsInDay_utc()', () => {
            for (var i = 0; i < (2 * 24 * 60 * 60); i += diff) {
                var instant = Instant.ofEpochSecond(i).plusNanos(123456789);
                var clock = Clock.fixed(instant, ZoneOffset.UTC);
                var test = ZonedDateTime.now(clock);
                assertEquals(test.year(), 1970);
                assertEquals(test.month(), Month.JANUARY);
                assertEquals(test.dayOfMonth(), (i < 24 * 60 * 60 ? 1 : 2));
                assertEquals(test.hour(), MathUtil.intMod(MathUtil.intDiv(i, (60 * 60)), 24));
                assertEquals(test.minute(), MathUtil.intMod(MathUtil.intDiv(i, 60), 60));
                assertEquals(test.second(), MathUtil.intMod(i, 60));
                assertEquals(test.nano(), 123456789);
                assertEquals(test.offset(), ZoneOffset.UTC);
                assertEquals(test.zone(), ZoneOffset.UTC);
            }
        });
       
        it('now_Clock_allSecsInDay_zone()', () => {
            var zone = ZoneId.systemDefault();
            for (var i = 0; i < (2 * 24 * 60 * 60); i+=diff) {
                var instant = Instant.ofEpochSecond(i).plusNanos(123456789);
                var expected = ZonedDateTime.ofInstant(instant, zone);
                var clock = Clock.fixed(expected.toInstant(), zone);
                var test = ZonedDateTime.now(clock);
                assertEquals(test, expected);
            }
        });
       
        it('now_Clock_allSecsInDay_beforeEpoch()', () => {
            var expected = LocalTime.MIDNIGHT.plusNanos(123456789);
            for (let i =-1; i >= -(24 * 60 * 60); i-=diff) {
                var instant = Instant.ofEpochSecond(i).plusNanos(123456789);
                var clock = Clock.fixed(instant, ZoneOffset.UTC);
                var test = ZonedDateTime.now(clock);
                assertEquals(test.year(), 1969);
                assertEquals(test.month(), Month.DECEMBER);
                assertEquals(test.dayOfMonth(), 31);
                expected = expected.minusSeconds(i===-1 ? 1 : diff);
                assertEquals(test.toLocalTime(), expected);
                assertEquals(test.offset(), ZoneOffset.UTC);
                assertEquals(test.zone(), ZoneOffset.UTC);
            }
        });
       
        it('now_Clock_offsets()', () => {
            var base = ZonedDateTime.of(LocalDateTime.of(1970, 1, 1, 12, 0), ZoneOffset.UTC);
            for (let i = -9; i < 15; i++) {
                var offset = ZoneOffset.ofHours(i);
                var clock = Clock.fixed(base.toInstant(), offset);
                var test = ZonedDateTime.now(clock);
                assertEquals(test.hour(), (12 + i) % 24);
                assertEquals(test.minute(), 0);
                assertEquals(test.second(), 0);
                assertEquals(test.nano(), 0);
                assertEquals(test.offset(), offset);
                assertEquals(test.zone(), offset);
            }
        });

    });

});



/**
 private static final var OFFSET_0100 = ZoneOffset.ofHours(1);
 private static final var OFFSET_0200 = ZoneOffset.ofHours(2);
 private static final var OFFSET_0130 = ZoneOffset.of("+01:30");
 private static final var OFFSET_MAX = ZoneOffset.ofHours(18);
 private static final var OFFSET_MIN = ZoneOffset.ofHours(-18);

 private static final var ZONE_0100 = OFFSET_0100;
 private static final var ZONE_0200 = OFFSET_0200;
 private static final var ZONE_M0100 = ZoneOffset.ofHours(-1);
 private static final var ZONE_PARIS = ZoneId.of("Europe/Paris");
 private LocalDateTime TEST_PARIS_GAP_2008_03_30_02_30;
 private LocalDateTime TEST_PARIS_OVERLAP_2008_10_26_02_30;
 private LocalDateTime TEST_LOCAL_2008_06_30_11_30_59_500;
 private ZonedDateTime TEST_DATE_TIME;
 private ZonedDateTime TEST_DATE_TIME_PARIS;

 @BeforeMethod
 it('setUp', () => {
     TEST_LOCAL_2008_06_30_11_30_59_500 = LocalDateTime.of(2008, 6, 30, 11, 30, 59, 500);
     TEST_DATE_TIME = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     TEST_DATE_TIME_PARIS = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_PARIS);
     TEST_PARIS_OVERLAP_2008_10_26_02_30 = LocalDateTime.of(2008, 10, 26, 2, 30);
     TEST_PARIS_GAP_2008_03_30_02_30 = LocalDateTime.of(2008, 3, 30, 2, 30);
 });

 //-----------------------------------------------------------------------
 @Override
 protected List<TemporalAccessor> samples() {
     TemporalAccessor[] array = {TEST_DATE_TIME, };
     return Arrays.asList(array);
 }

 @Override
 protected List<TemporalField> validFields() {
     TemporalField[] array = {
         NANO_OF_SECOND,
         NANO_OF_DAY,
         MICRO_OF_SECOND,
         MICRO_OF_DAY,
         MILLI_OF_SECOND,
         MILLI_OF_DAY,
         SECOND_OF_MINUTE,
         SECOND_OF_DAY,
         MINUTE_OF_HOUR,
         MINUTE_OF_DAY,
         CLOCK_HOUR_OF_AMPM,
         HOUR_OF_AMPM,
         CLOCK_HOUR_OF_DAY,
         HOUR_OF_DAY,
         AMPM_OF_DAY,
         DAY_OF_WEEK,
         ALIGNED_DAY_OF_WEEK_IN_MONTH,
         ALIGNED_DAY_OF_WEEK_IN_YEAR,
         DAY_OF_MONTH,
         DAY_OF_YEAR,
         EPOCH_DAY,
         ALIGNED_WEEK_OF_MONTH,
         ALIGNED_WEEK_OF_YEAR,
         MONTH_OF_YEAR,
         PROLEPTIC_MONTH,
         YEAR_OF_ERA,
         YEAR,
         ERA,
         OFFSET_SECONDS,
         INSTANT_SECONDS,
         JulianFields.JULIAN_DAY,
         JulianFields.MODIFIED_JULIAN_DAY,
         JulianFields.RATA_DIE,
     };
     return Arrays.asList(array);
 }

 @Override
 protected List<TemporalField> invalidFields() {
     List<TemporalField> list = new ArrayList<TemporalField>(Arrays.<TemporalField>asList(ChronoField.values()));
     list.removeAll(validFields());
     return list;
 }

 //-----------------------------------------------------------------------
 @Test
 public void test_serialization() throws ClassNotFoundException, IOException {
     assertSerializable(TEST_DATE_TIME);
 }

 @Test
 public void test_serialization_format() throws ClassNotFoundException, IOException {
     var zdt = LocalDateTime.of(2012, 9, 16, 22, 17, 59, 470 * 1000000).atZone(ZoneId.of("Europe/London"));
     assertEqualsSerialisedForm(zdt);
 }

 //-----------------------------------------------------------------------
 // dateTime factories
 //-----------------------------------------------------------------------
 void check(ZonedDateTime test, int y, int m, int d, int h, int min, int s, int n, ZoneOffset offset, ZoneId zone) {
     assertEquals(test.year(), y);
     assertEquals(test.month().value(), m);
     assertEquals(test.dayOfMonth(), d);
     assertEquals(test.hour(), h);
     assertEquals(test.minute(), min);
     assertEquals(test.second(), s);
     assertEquals(test.nano(), n);
     assertEquals(test.offset(), offset);
     assertEquals(test.zone(), zone);
 }

 //-----------------------------------------------------------------------
 // of(LocalDateTime, ZoneId)
 //-----------------------------------------------------------------------
 // TODO: tests of overlap/gap

 @Test
 it('factory_of_LocalDateTime', () => {
     var base = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 500);
     var test = ZonedDateTime.of(base, ZONE_PARIS);
     check(test, 2008, 6, 30, 11, 30, 10, 500, OFFSET_0200, ZONE_PARIS);
 });

 it('factory_of_LocalDateTime_nullDateTime', () => {
expect(() => {
     ZonedDateTime.of((LocalDateTime) null, ZONE_PARIS);
 
}).to.throw(NullPointerException);
});

 it('factory_of_LocalDateTime_nullZone', () => {
expect(() => {
     var base = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 500);
     ZonedDateTime.of(base, null);
 
}).to.throw(NullPointerException);
});

 //-----------------------------------------------------------------------
 // ofInstant(Instant, ZoneId)
 //-----------------------------------------------------------------------
 @Test
 it('factory_ofInstant_Instant_ZR', () => {
     var instant = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 35).toInstant(OFFSET_0200);
     var test = ZonedDateTime.ofInstant(instant, ZONE_PARIS);
     check(test, 2008, 6, 30, 11, 30, 10, 35, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('factory_ofInstant_Instant_ZO', () => {
     var instant = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 45).toInstant(OFFSET_0200);
     var test = ZonedDateTime.ofInstant(instant, OFFSET_0200);
     check(test, 2008, 6, 30, 11, 30, 10, 45, OFFSET_0200, OFFSET_0200);
 });

 @Test
 it('factory_ofInstant_Instant_inGap', () => {
     var instant = TEST_PARIS_GAP_2008_03_30_02_30.toInstant(OFFSET_0100);
     var test = ZonedDateTime.ofInstant(instant, ZONE_PARIS);
     check(test, 2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS);  // one hour later in summer offset
 });

 @Test
 it('factory_ofInstant_Instant_inOverlap_earlier', () => {
     var instant = TEST_PARIS_OVERLAP_2008_10_26_02_30.toInstant(OFFSET_0200);
     var test = ZonedDateTime.ofInstant(instant, ZONE_PARIS);
     check(test, 2008, 10, 26, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS);  // same time and offset
 });

 @Test
 it('factory_ofInstant_Instant_inOverlap_later', () => {
     var instant = TEST_PARIS_OVERLAP_2008_10_26_02_30.toInstant(OFFSET_0100);
     var test = ZonedDateTime.ofInstant(instant, ZONE_PARIS);
     check(test, 2008, 10, 26, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS);  // same time and offset
 });

 @Test
 it('factory_ofInstant_Instant_invalidOffset', () => {
     var instant = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 500).toInstant(OFFSET_0130);
     var test = ZonedDateTime.ofInstant(instant, ZONE_PARIS);
     check(test, 2008, 6, 30, 12, 0, 10, 500, OFFSET_0200, ZONE_PARIS);  // corrected offset, thus altered time
 });

 @Test
 public void factory_ofInstant_allSecsInDay() {
     for (var i = 0; i < (24 * 60 * 60); i++) {
         var instant = Instant.ofEpochSecond(i);
         var test = ZonedDateTime.ofInstant(instant, OFFSET_0100);
         assertEquals(test.year(), 1970);
         assertEquals(test.month(), Month.JANUARY);
         assertEquals(test.dayOfMonth(), 1 + (i >= 23 * 60 * 60 ? 1 : 0));
         assertEquals(test.hour(), ((i / (60 * 60)) + 1) % 24);
         assertEquals(test.minute(), (i / 60) % 60);
         assertEquals(test.second(), i % 60);
     }
 }

 @Test
 public void factory_ofInstant_allDaysInCycle() {
     // sanity check using different algorithm
     var expected = LocalDateTime.of(1970, 1, 1, 0, 0, 0, 0).atZone(ZoneOffset.UTC);
     for (var i = 0; i < 146097; i++) {
         var instant = Instant.ofEpochSecond(i * 24 * 60 * 60);
         var test = ZonedDateTime.ofInstant(instant, ZoneOffset.UTC);
         assertEquals(test, expected);
         expected = expected.plusDays(1);
     }
 }

 @Test
 it('factory_ofInstant_minWithMinOffset', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MIN_VALUE;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) - days_0000_to_1970;
     var instant = Instant.ofEpochSecond(days * 24 * 60 * 60 - OFFSET_MIN.totalseconds());
     var test = ZonedDateTime.ofInstant(instant, OFFSET_MIN);
     assertEquals(test.year(), Year.MIN_VALUE);
     assertEquals(test.month().value(), 1);
     assertEquals(test.dayOfMonth(), 1);
     assertEquals(test.offset(), OFFSET_MIN);
     assertEquals(test.hour(), 0);
     assertEquals(test.minute(), 0);
     assertEquals(test.second(), 0);
     assertEquals(test.nano(), 0);
 });

 @Test
 it('factory_ofInstant_minWithMaxOffset', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MIN_VALUE;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) - days_0000_to_1970;
     var instant = Instant.ofEpochSecond(days * 24 * 60 * 60 - OFFSET_MAX.totalseconds());
     var test = ZonedDateTime.ofInstant(instant, OFFSET_MAX);
     assertEquals(test.year(), Year.MIN_VALUE);
     assertEquals(test.month().value(), 1);
     assertEquals(test.dayOfMonth(), 1);
     assertEquals(test.offset(), OFFSET_MAX);
     assertEquals(test.hour(), 0);
     assertEquals(test.minute(), 0);
     assertEquals(test.second(), 0);
     assertEquals(test.nano(), 0);
 });

 @Test
 it('factory_ofInstant_maxWithMinOffset', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MAX_VALUE;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) + 365 - days_0000_to_1970;
     var instant = Instant.ofEpochSecond((days + 1) * 24 * 60 * 60 - 1 - OFFSET_MIN.totalseconds());
     var test = ZonedDateTime.ofInstant(instant, OFFSET_MIN);
     assertEquals(test.year(), Year.MAX_VALUE);
     assertEquals(test.month().value(), 12);
     assertEquals(test.dayOfMonth(), 31);
     assertEquals(test.offset(), OFFSET_MIN);
     assertEquals(test.hour(), 23);
     assertEquals(test.minute(), 59);
     assertEquals(test.second(), 59);
     assertEquals(test.nano(), 0);
 });

 @Test
 it('factory_ofInstant_maxWithMaxOffset', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MAX_VALUE;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) + 365 - days_0000_to_1970;
     var instant = Instant.ofEpochSecond((days + 1) * 24 * 60 * 60 - 1 - OFFSET_MAX.totalseconds());
     var test = ZonedDateTime.ofInstant(instant, OFFSET_MAX);
     assertEquals(test.year(), Year.MAX_VALUE);
     assertEquals(test.month().value(), 12);
     assertEquals(test.dayOfMonth(), 31);
     assertEquals(test.offset(), OFFSET_MAX);
     assertEquals(test.hour(), 23);
     assertEquals(test.minute(), 59);
     assertEquals(test.second(), 59);
     assertEquals(test.nano(), 0);
 });

 //-----------------------------------------------------------------------
 it('factory_ofInstant_maxInstantWithMaxOffset', () => {
expect(() => {
     var instant = Instant.ofEpochSecond(Long.MAX_VALUE);
     ZonedDateTime.ofInstant(instant, OFFSET_MAX);
 
}).to.throw(DateTimeException);
});

 it('factory_ofInstant_maxInstantWithMinOffset', () => {
expect(() => {
     var instant = Instant.ofEpochSecond(Long.MAX_VALUE);
     ZonedDateTime.ofInstant(instant, OFFSET_MIN);
 
}).to.throw(DateTimeException);
});

 @Test(expectedExceptions=DateTimeException.class)
 it('factory_ofInstant_tooBig', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MAX_VALUE + 1;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) - days_0000_to_1970;
     var instant = Instant.ofEpochSecond(days * 24 * 60 * 60);
     ZonedDateTime.ofInstant(instant, ZoneOffset.UTC);
 });

 @Test(expectedExceptions=DateTimeException.class)
 it('factory_ofInstant_tooLow', () => {
     var days_0000_to_1970 = (146097 * 5) - (30 * 365 + 7);
     var year = Year.MIN_VALUE - 1;
     var days = (year * 365 + (year / 4 - year / 100 + year / 400)) - days_0000_to_1970;
     var instant = Instant.ofEpochSecond(days * 24 * 60 * 60);
     ZonedDateTime.ofInstant(instant, ZoneOffset.UTC);
 });

 it('factory_ofInstant_Instant_nullInstant', () => {
expect(() => {
     ZonedDateTime.ofInstant((Instant) null, ZONE_0100);
 
}).to.throw(NullPointerException);
});

 it('factory_ofInstant_Instant_nullZone', () => {
expect(() => {
     ZonedDateTime.ofInstant(Instant.EPOCH, null);
 
}).to.throw(NullPointerException);
});

 //-----------------------------------------------------------------------
 // ofStrict(LocalDateTime, ZoneId, ZoneOffset)
 //-----------------------------------------------------------------------
 @Test
 it('factory_ofStrict_LDT_ZI_ZO', () => {
     var normal = LocalDateTime.of(2008, 6, 30, 11, 30, 10, 500);
     var test = ZonedDateTime.ofStrict(normal, OFFSET_0200, ZONE_PARIS);
     check(test, 2008, 6, 30, 11, 30, 10, 500, OFFSET_0200, ZONE_PARIS);
 });

 @Test(expectedExceptions=DateTimeException.class)
 public void factory_ofStrict_LDT_ZI_ZO_inGap() {
     try {
         ZonedDateTime.ofStrict(TEST_PARIS_GAP_2008_03_30_02_30, OFFSET_0100, ZONE_PARIS);
     } catch (DateTimeException ex) {
         assertEquals(ex.message().contains(" gap"), true);
         throw ex;
     }
 }

 @Test(expectedExceptions=DateTimeException.class)
 public void factory_ofStrict_LDT_ZI_ZO_inOverlap_invalidOfset() {
     try {
         ZonedDateTime.ofStrict(TEST_PARIS_OVERLAP_2008_10_26_02_30, OFFSET_0130, ZONE_PARIS);
     } catch (DateTimeException ex) {
         assertEquals(ex.message().contains(" is not valid for "), true);
         throw ex;
     }
 }

 @Test(expectedExceptions=DateTimeException.class)
 public void factory_ofStrict_LDT_ZI_ZO_invalidOffset() {
     try {
         ZonedDateTime.ofStrict(TEST_LOCAL_2008_06_30_11_30_59_500, OFFSET_0130, ZONE_PARIS);
     } catch (DateTimeException ex) {
         assertEquals(ex.message().contains(" is not valid for "), true);
         throw ex;
     }
 }

 it('factory_ofStrict_LDT_ZI_ZO_nullLDT', () => {
expect(() => {
     ZonedDateTime.ofStrict((LocalDateTime) null, OFFSET_0100, ZONE_PARIS);
 
}).to.throw(NullPointerException);
});

 it('factory_ofStrict_LDT_ZI_ZO_nullZO', () => {
expect(() => {
     ZonedDateTime.ofStrict(TEST_LOCAL_2008_06_30_11_30_59_500, null, ZONE_PARIS);
 
}).to.throw(NullPointerException);
});

 it('factory_ofStrict_LDT_ZI_ZO_nullZI', () => {
expect(() => {
     ZonedDateTime.ofStrict(TEST_LOCAL_2008_06_30_11_30_59_500, OFFSET_0100, null);
 
}).to.throw(NullPointerException);
});

 describe('from(DateTimeAccessor)', () => {

});

 @Test
 it('factory_from_DateTimeAccessor_ZDT', () => {
     assertEquals(ZonedDateTime.from(TEST_DATE_TIME_PARIS), TEST_DATE_TIME_PARIS);
 });

 @Test
 public void factory_from_DateTimeAccessor_LDT_ZoneId() {
     assertEquals(ZonedDateTime.from(new DefaultInterfaceTemporalAccessor() {
         @Override
         public boolean isSupported(TemporalField field) {
             return TEST_DATE_TIME_PARIS.toLocalDateTime().isSupported(field);
         }
         @Override
         public long getLong(TemporalField field) {
             return TEST_DATE_TIME_PARIS.toLocalDateTime().getLong(field);
         }
         @SuppressWarnings("unchecked")
         @Override
         public <R> R query(TemporalQuery<R> query) {
             if (query == TemporalQueries.zoneId()) {
                 return (R) TEST_DATE_TIME_PARIS.zone();
             }
             return super.query(query);
         }
     }), TEST_DATE_TIME_PARIS);
 }

 @Test
 public void factory_from_DateTimeAccessor_Instant_ZoneId() {
     assertEquals(ZonedDateTime.from(new DefaultInterfaceTemporalAccessor() {
         @Override
         public boolean isSupported(TemporalField field) {
             return field == INSTANT_SECONDS || field == NANO_OF_SECOND;
         }
         @Override
         public long getLong(TemporalField field) {
             return TEST_DATE_TIME_PARIS.toInstant().getLong(field);
         }
         @SuppressWarnings("unchecked")
         @Override
         public <R> R query(TemporalQuery<R> query) {
             if (query == TemporalQueries.zoneId()) {
                 return (R) TEST_DATE_TIME_PARIS.zone();
             }
             return super.query(query);
         }
     }), TEST_DATE_TIME_PARIS);
 }

 it('factory_from_DateTimeAccessor_invalid_noDerive', () => {
expect(() => {
     ZonedDateTime.from(LocalTime.of(12, 30));
 
}).to.throw(DateTimeException);
});

 it('factory_from_DateTimeAccessor_null', () => {
expect(() => {
     ZonedDateTime.from((TemporalAccessor) null);
 
}).to.throw(NullPointerException);
});

 describe('parse()', () => {

});

 @Test(dataProvider="sampleToString")
 public void test_parse(int y, int month, int d, int h, int m, int s, int n, String zoneId, String text) {
     var t = ZonedDateTime.parse(text);
     assertEquals(t.year(), y);
     assertEquals(t.month().value(), month);
     assertEquals(t.dayOfMonth(), d);
     assertEquals(t.hour(), h);
     assertEquals(t.minute(), m);
     assertEquals(t.second(), s);
     assertEquals(t.nano(), n);
     assertEquals(t.zone().id(), zoneId);
 }

 @DataProvider(name="parseAdditional")
 Object[][] data_parseAdditional() {
     return new Object[][] {
             {"2012-06-30T12:30:40Z[GMT]", 2012, 6, 30, 12, 30, 40, 0, "GMT"},
             {"2012-06-30T12:30:40Z[UT]", 2012, 6, 30, 12, 30, 40, 0, "UT"},
             {"2012-06-30T12:30:40Z[UTC]", 2012, 6, 30, 12, 30, 40, 0, "UTC"},
             {"2012-06-30T12:30:40+01:00[+01:00]", 2012, 6, 30, 12, 30, 40, 0, "+01:00"},
             {"2012-06-30T12:30:40+01:00[GMT+01:00]", 2012, 6, 30, 12, 30, 40, 0, "GMT+01:00"},
             {"2012-06-30T12:30:40+01:00[UT+01:00]", 2012, 6, 30, 12, 30, 40, 0, "UT+01:00"},
             {"2012-06-30T12:30:40+01:00[UTC+01:00]", 2012, 6, 30, 12, 30, 40, 0, "UTC+01:00"},
             {"2012-06-30T12:30:40-01:00[-01:00]", 2012, 6, 30, 12, 30, 40, 0, "-01:00"},
             {"2012-06-30T12:30:40-01:00[GMT-01:00]", 2012, 6, 30, 12, 30, 40, 0, "GMT-01:00"},
             {"2012-06-30T12:30:40-01:00[UT-01:00]", 2012, 6, 30, 12, 30, 40, 0, "UT-01:00"},
             {"2012-06-30T12:30:40-01:00[UTC-01:00]", 2012, 6, 30, 12, 30, 40, 0, "UTC-01:00"},
             {"2012-06-30T12:30:40+01:00[Europe/London]", 2012, 6, 30, 12, 30, 40, 0, "Europe/London"},
     };
 }

 @Test(dataProvider="parseAdditional")
 public void test_parseAdditional(String text, int y, int month, int d, int h, int m, int s, int n, String zoneId) {
     var t = ZonedDateTime.parse(text);
     assertEquals(t.year(), y);
     assertEquals(t.month().value(), month);
     assertEquals(t.dayOfMonth(), d);
     assertEquals(t.hour(), h);
     assertEquals(t.minute(), m);
     assertEquals(t.second(), s);
     assertEquals(t.nano(), n);
     assertEquals(t.zone().id(), zoneId);
 }

 @Test(expectedExceptions=DateTimeParseException.class)
 public void factory_parse_illegalValue() {
     ZonedDateTime.parse("2008-06-32T11:15+01:00[Europe/Paris]");
 }

 @Test(expectedExceptions=DateTimeParseException.class)
 public void factory_parse_invalidValue() {
     ZonedDateTime.parse("2008-06-31T11:15+01:00[Europe/Paris]");
 }

 it('factory_parse_nullText', () => {
expect(() => {
     ZonedDateTime.parse((String) null);
 
}).to.throw(NullPointerException);
});

 describe('parse(DateTimeFormatter)', () => {

});

 @Test
 public void factory_parse_formatter() {
     var f = DateTimeFormatter.ofPattern("u M d H m s VV");
     var test = ZonedDateTime.parse("2010 12 3 11 30 0 Europe/London", f);
     assertEquals(test, ZonedDateTime.of(LocalDateTime.of(2010, 12, 3, 11, 30), ZoneId.of("Europe/London")));
 }

 @Test(expectedExceptions=NullPointerException.class)
 public void factory_parse_formatter_nullText() {
     var f = DateTimeFormatter.ofPattern("y M d H m s");
     ZonedDateTime.parse((String) null, f);
 }

 @Test(expectedExceptions=NullPointerException.class)
 public void factory_parse_formatter_nullFormatter() {
     ZonedDateTime.parse("ANY", null);
 }

 describe('basics', () => {

});

 @DataProvider(name="sampleTimes")
 Object[][] provider_sampleTimes() {
     return new Object[][] {
         {2008, 6, 30, 11, 30, 20, 500, ZONE_0100},
         {2008, 6, 30, 11, 0, 0, 0, ZONE_0100},
         {2008, 6, 30, 11, 30, 20, 500, ZONE_PARIS},
         {2008, 6, 30, 11, 0, 0, 0, ZONE_PARIS},
         {2008, 6, 30, 23, 59, 59, 999999999, ZONE_0100},
         {-1, 1, 1, 0, 0, 0, 0, ZONE_0100},
     };
 }

 @Test(dataProvider="sampleTimes")
 public void test_get(int y, int o, int d, int h, int m, int s, int n, ZoneId zone) {
     var localDate = LocalDate.of(y, o, d);
     var localTime = LocalTime.of(h, m, s, n);
     var localDateTime = LocalDateTime.of(localDate, localTime);
     var offset = zone.rules().getOffset(localDateTime);
     var a = ZonedDateTime.of(localDateTime, zone);

     assertEquals(a.year(), localDate.year());
     assertEquals(a.month(), localDate.month());
     assertEquals(a.dayOfMonth(), localDate.dayOfMonth());
     assertEquals(a.dayofyear(), localDate.dayofyear());
     assertEquals(a.dayofweek(), localDate.dayofweek());

     assertEquals(a.hour(), localTime.hour());
     assertEquals(a.minute(), localTime.minute());
     assertEquals(a.second(), localTime.second());
     assertEquals(a.nano(), localTime.nano());

     assertEquals(a.toLocalDate(), localDate);
     assertEquals(a.toLocalTime(), localTime);
     assertEquals(a.toLocalDateTime(), localDateTime);
     if (zone instanceof ZoneOffset) {
         assertEquals(a.toString(), localDateTime.toString() + offset.toString());
     } else {
         assertEquals(a.toString(), localDateTime.toString() + offset.toString() + "[" + zone.toString() + "]");
     }
 }

 describe('get(DateTimeField)', () => {

});

 @Test
 it('test_get_DateTimeField', () => {
     var test = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 12, 30, 40, 987654321), ZONE_0100);
     assertEquals(test.get(ChronoField.YEAR), 2008);
     assertEquals(test.get(ChronoField.MONTH_OF_YEAR), 6);
     assertEquals(test.get(ChronoField.DAY_OF_MONTH), 30);
     assertEquals(test.get(ChronoField.DAY_OF_WEEK), 1);
     assertEquals(test.get(ChronoField.DAY_OF_YEAR), 182);

     assertEquals(test.get(ChronoField.HOUR_OF_DAY), 12);
     assertEquals(test.get(ChronoField.MINUTE_OF_HOUR), 30);
     assertEquals(test.get(ChronoField.SECOND_OF_MINUTE), 40);
     assertEquals(test.get(ChronoField.NANO_OF_SECOND), 987654321);
     assertEquals(test.get(ChronoField.HOUR_OF_AMPM), 0);
     assertEquals(test.get(ChronoField.AMPM_OF_DAY), 1);

     assertEquals(test.get(ChronoField.OFFSET_SECONDS), 3600);
 });

 it('test_get_DateTimeField_long', () => {
expect(() => {
     TEST_DATE_TIME.get(ChronoField.INSTANT_SECONDS);
 
}).to.throw(DateTimeException);
});

 it('test_get_DateTimeField_invalidField', () => {
expect(() => {
     TEST_DATE_TIME.get(MockFieldNoValue.INSTANCE);
 
}).to.throw(DateTimeException);
});

 it('test_get_DateTimeField_null', () => {
expect(() => {
     TEST_DATE_TIME.get((TemporalField) null);
 
}).to.throw(NullPointerException);
});

 describe('getLong(DateTimeField)', () => {

});

 @Test
 it('test_getLong_DateTimeField', () => {
     var test = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 12, 30, 40, 987654321), ZONE_0100);
     assertEquals(test.getLong(ChronoField.YEAR), 2008);
     assertEquals(test.getLong(ChronoField.MONTH_OF_YEAR), 6);
     assertEquals(test.getLong(ChronoField.DAY_OF_MONTH), 30);
     assertEquals(test.getLong(ChronoField.DAY_OF_WEEK), 1);
     assertEquals(test.getLong(ChronoField.DAY_OF_YEAR), 182);

     assertEquals(test.getLong(ChronoField.HOUR_OF_DAY), 12);
     assertEquals(test.getLong(ChronoField.MINUTE_OF_HOUR), 30);
     assertEquals(test.getLong(ChronoField.SECOND_OF_MINUTE), 40);
     assertEquals(test.getLong(ChronoField.NANO_OF_SECOND), 987654321);
     assertEquals(test.getLong(ChronoField.HOUR_OF_AMPM), 0);
     assertEquals(test.getLong(ChronoField.AMPM_OF_DAY), 1);

     assertEquals(test.getLong(ChronoField.OFFSET_SECONDS), 3600);
     assertEquals(test.getLong(ChronoField.INSTANT_SECONDS), test.toEpochSecond());
 });

 it('test_getLong_DateTimeField_invalidField', () => {
expect(() => {
     TEST_DATE_TIME.getLong(MockFieldNoValue.INSTANCE);
 
}).to.throw(DateTimeException);
});

 it('test_getLong_DateTimeField_null', () => {
expect(() => {
     TEST_DATE_TIME.getLong((TemporalField) null);
 
}).to.throw(NullPointerException);
});

 describe('query(TemporalQuery)', () => {

});

 @Test
 it('test_query', () => {
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.chronology()), IsoChronology.INSTANCE);
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.localDate()), TEST_DATE_TIME.toLocalDate());
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.localTime()), TEST_DATE_TIME.toLocalTime());
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.offset()), TEST_DATE_TIME.offset());
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.precision()), ChronoUnit.NANOS);
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.zone()), TEST_DATE_TIME.zone());
     assertEquals(TEST_DATE_TIME.query(TemporalQueries.zoneId()), TEST_DATE_TIME.zone());
 });

 it('test_query_null', () => {
expect(() => {
     TEST_DATE_TIME.query(null);
 
}).to.throw(NullPointerException);
});

 describe('withEarlierOffsetAtOverlap()', () => {

});

 @Test
 it('test_withEarlierOffsetAtOverlap_notAtOverlap', () => {
     var base = ZonedDateTime.ofStrict(TEST_LOCAL_2008_06_30_11_30_59_500, OFFSET_0200, ZONE_PARIS);
     var test = base.withEarlierOffsetAtOverlap();
     assertEquals(test, base);  // not changed
 });

 @Test
 it('test_withEarlierOffsetAtOverlap_atOverlap', () => {
     var base = ZonedDateTime.ofStrict(TEST_PARIS_OVERLAP_2008_10_26_02_30, OFFSET_0100, ZONE_PARIS);
     var test = base.withEarlierOffsetAtOverlap();
     assertEquals(test.offset(), OFFSET_0200);  // offset changed to earlier
     assertEquals(test.toLocalDateTime(), base.toLocalDateTime());  // date-time not changed
 });

 @Test
 it('test_withEarlierOffsetAtOverlap_atOverlap_noChange', () => {
     var base = ZonedDateTime.ofStrict(TEST_PARIS_OVERLAP_2008_10_26_02_30, OFFSET_0200, ZONE_PARIS);
     var test = base.withEarlierOffsetAtOverlap();
     assertEquals(test, base);  // not changed
 });

 describe('withLaterOffsetAtOverlap()', () => {

});

 @Test
 it('test_withLaterOffsetAtOverlap_notAtOverlap', () => {
     var base = ZonedDateTime.ofStrict(TEST_LOCAL_2008_06_30_11_30_59_500, OFFSET_0200, ZONE_PARIS);
     var test = base.withLaterOffsetAtOverlap();
     assertEquals(test, base);  // not changed
 });

 @Test
 it('test_withLaterOffsetAtOverlap_atOverlap', () => {
     var base = ZonedDateTime.ofStrict(TEST_PARIS_OVERLAP_2008_10_26_02_30, OFFSET_0200, ZONE_PARIS);
     var test = base.withLaterOffsetAtOverlap();
     assertEquals(test.offset(), OFFSET_0100);  // offset changed to later
     assertEquals(test.toLocalDateTime(), base.toLocalDateTime());  // date-time not changed
 });

 @Test
 it('test_withLaterOffsetAtOverlap_atOverlap_noChange', () => {
     var base = ZonedDateTime.ofStrict(TEST_PARIS_OVERLAP_2008_10_26_02_30, OFFSET_0100, ZONE_PARIS);
     var test = base.withLaterOffsetAtOverlap();
     assertEquals(test, base);  // not changed
 });

 describe('withZoneSameLocal(ZoneId)', () => {

});

 @Test
 it('test_withZoneSameLocal', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.withZoneSameLocal(ZONE_0200);
     assertEquals(test.toLocalDateTime(), base.toLocalDateTime());
 });

 @Test
 it('test_withZoneSameLocal_noChange', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.withZoneSameLocal(ZONE_0100);
     assertEquals(test, base);
 });

 @Test
 public void test_withZoneSameLocal_retainOffset1() {
     var ldt = LocalDateTime.of(2008, 11, 2, 1, 30, 59, 0);  // overlap
     var base = ZonedDateTime.of(ldt, ZoneId.of("UTC-04:00") );
     var test = base.withZoneSameLocal(ZoneId.of("America/New_York"));
     assertEquals(base.offset(), ZoneOffset.ofHours(-4));
     assertEquals(test.offset(), ZoneOffset.ofHours(-4));
 }

 @Test
 public void test_withZoneSameLocal_retainOffset2() {
     var ldt = LocalDateTime.of(2008, 11, 2, 1, 30, 59, 0);  // overlap
     var base = ZonedDateTime.of(ldt, ZoneId.of("UTC-05:00") );
     var test = base.withZoneSameLocal(ZoneId.of("America/New_York"));
     assertEquals(base.offset(), ZoneOffset.ofHours(-5));
     assertEquals(test.offset(), ZoneOffset.ofHours(-5));
 }

 it('test_withZoneSameLocal_null', () => {
expect(() => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     base.withZoneSameLocal(null);
 
}).to.throw(NullPointerException);
});

 describe('withZoneSameInstant()', () => {

});

 @Test
 it('test_withZoneSameInstant', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withZoneSameInstant(ZONE_0200);
     var expected = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.plusHours(1), ZONE_0200);
     assertEquals(test, expected);
 });

 @Test
 it('test_withZoneSameInstant_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withZoneSameInstant(ZONE_0100);
     assertEquals(test, base);
 });

 it('test_withZoneSameInstant_null', () => {
expect(() => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     base.withZoneSameInstant(null);
 
}).to.throw(NullPointerException);
});

 describe('withFixedOffsetZone()', () => {

});

 @Test
 it('test_withZoneLocked', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_PARIS);
     var test = base.withFixedOffsetZone();
     var expected = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0200);
     assertEquals(test, expected);
 });

 describe('with(WithAdjuster)', () => {

});

 @Test
 it('test_with_WithAdjuster_LocalDateTime_sameOffset', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_PARIS);
     var test = base.with(LocalDateTime.of(2012, 7, 15, 14, 30));
     check(test, 2012, 7, 15, 14, 30, 0, 0, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_LocalDateTime_adjustedOffset', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_PARIS);
     var test = base.with(LocalDateTime.of(2012, 1, 15, 14, 30));
     check(test, 2012, 1, 15, 14, 30, 0, 0, OFFSET_0100, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_LocalDate', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_PARIS);
     var test = base.with(LocalDate.of(2012, 7, 28));
     check(test, 2012, 7, 28, 11, 30, 59, 500, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_LocalTime', () => {
     var base = ZonedDateTime.of(TEST_PARIS_OVERLAP_2008_10_26_02_30, ZONE_PARIS);
     var test = base.with(LocalTime.of(2, 29));
     check(test, 2008, 10, 26, 2, 29, 0, 0, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_Year', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.with(Year.of(2007));
     assertEquals(test, ZonedDateTime.of(ldt.withYear(2007), ZONE_0100));
 });

 @Test
 it('test_with_WithAdjuster_Month_adjustedDayOfMonth', () => {
     var base = ZonedDateTime.of(LocalDateTime.of(2012, 7, 31, 0, 0), ZONE_PARIS);
     var test = base.with(Month.JUNE);
     check(test, 2012, 6, 30, 0, 0, 0, 0, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_Offset_same', () => {
     var base = ZonedDateTime.of(LocalDateTime.of(2012, 7, 31, 0, 0), ZONE_PARIS);
     var test = base.with(ZoneOffset.ofHours(2));
     check(test, 2012, 7, 31, 0, 0, 0, 0, OFFSET_0200, ZONE_PARIS);
 });

 @Test
 it('test_with_WithAdjuster_Offset_ignored', () => {
     var base = ZonedDateTime.of(LocalDateTime.of(2012, 7, 31, 0, 0), ZONE_PARIS);
     var test = base.with(ZoneOffset.ofHours(1));
     check(test, 2012, 7, 31, 0, 0, 0, 0, OFFSET_0200, ZONE_PARIS);  // offset ignored
 });

 @Test
 public void test_with_WithAdjuster_LocalDate_retainOffset1() {
     var newYork = ZoneId.of("America/New_York");
     var ldt = LocalDateTime.of(2008, 11, 1, 1, 30);
     var base = ZonedDateTime.of(ldt, newYork);
     assertEquals(base.offset(), ZoneOffset.ofHours(-4));
     var test = base.with(LocalDate.of(2008, 11, 2));
     assertEquals(test.offset(), ZoneOffset.ofHours(-4));
 }

 @Test
 public void test_with_WithAdjuster_LocalDate_retainOffset2() {
     var newYork = ZoneId.of("America/New_York");
     var ldt = LocalDateTime.of(2008, 11, 3, 1, 30);
     var base = ZonedDateTime.of(ldt, newYork);
     assertEquals(base.offset(), ZoneOffset.ofHours(-5));
     var test = base.with(LocalDate.of(2008, 11, 2));
     assertEquals(test.offset(), ZoneOffset.ofHours(-5));
 }

 it('test_with_WithAdjuster_null', () => {
expect(() => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     base.with((TemporalAdjuster) null);
 
}).to.throw(NullPointerException);
});

 describe('withYear()', () => {

});

 @Test
 it('test_withYear_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withYear(2007);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withYear(2007), ZONE_0100));
 });

 @Test
 it('test_withYear_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withYear(2008);
     assertEquals(test, base);
 });

 describe('with(Month)', () => {

});

 @Test
 it('test_withMonth_Month_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.with(JANUARY);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withMonth(1), ZONE_0100));
 });

 @Test(expectedExceptions = NullPointerException.class)
 it('test_withMonth_Month_null', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     base.with((Month) null);
 });

 describe('withMonth()', () => {

});

 @Test
 it('test_withMonth_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withMonth(1);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withMonth(1), ZONE_0100));
 });

 @Test
 it('test_withMonth_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withMonth(6);
     assertEquals(test, base);
 });

 it('test_withMonth_tooBig', () => {
expect(() => {
     TEST_DATE_TIME.withMonth(13);
 
}).to.throw(DateTimeException);
});

 it('test_withMonth_tooSmall', () => {
expect(() => {
     TEST_DATE_TIME.withMonth(0);
 
}).to.throw(DateTimeException);
});

 describe('withDayOfMonth()', () => {

});

 @Test
 it('test_withDayOfMonth_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withDayOfMonth(15);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withDayOfMonth(15), ZONE_0100));
 });

 @Test
 it('test_withDayOfMonth_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withDayOfMonth(30);
     assertEquals(test, base);
 });

 it('test_withDayOfMonth_tooBig', () => {
expect(() => {
     LocalDateTime.of(2007, 7, 2, 11, 30).atZone(ZONE_PARIS).withDayOfMonth(32);
 
}).to.throw(DateTimeException);
});

 it('test_withDayOfMonth_tooSmall', () => {
expect(() => {
     TEST_DATE_TIME.withDayOfMonth(0);
 
}).to.throw(DateTimeException);
});

 it('test_withDayOfMonth_invalid31', () => {
expect(() => {
     LocalDateTime.of(2007, 6, 2, 11, 30).atZone(ZONE_PARIS).withDayOfMonth(31);
 
}).to.throw(DateTimeException);
});

 describe('withDayOfYear()', () => {

});

 @Test
 it('test_withDayOfYear_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withDayOfYear(33);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withDayOfYear(33), ZONE_0100));
 });

 @Test
 it('test_withDayOfYear_noChange', () => {
     var ldt = LocalDateTime.of(2008, 2, 5, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.withDayOfYear(36);
     assertEquals(test, base);
 });

 it('test_withDayOfYear_tooBig', () => {
expect(() => {
     TEST_DATE_TIME.withDayOfYear(367);
 
}).to.throw(DateTimeException);
});

 it('test_withDayOfYear_tooSmall', () => {
expect(() => {
     TEST_DATE_TIME.withDayOfYear(0);
 
}).to.throw(DateTimeException);
});

 it('test_withDayOfYear_invalid366', () => {
expect(() => {
     LocalDateTime.of(2007, 2, 2, 11, 30).atZone(ZONE_PARIS).withDayOfYear(366);
 
}).to.throw(DateTimeException);
});

 describe('withHour()', () => {

});

 @Test
 it('test_withHour_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withHour(15);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withHour(15), ZONE_0100));
 });

 @Test
 it('test_withHour_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withHour(11);
     assertEquals(test, base);
 });

 describe('withMinute()', () => {

});

 @Test
 it('test_withMinute_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withMinute(15);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withMinute(15), ZONE_0100));
 });

 @Test
 it('test_withMinute_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withMinute(30);
     assertEquals(test, base);
 });

 describe('withSecond()', () => {

});

 @Test
 it('test_withSecond_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withSecond(12);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withSecond(12), ZONE_0100));
 });

 @Test
 it('test_withSecond_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withSecond(59);
     assertEquals(test, base);
 });

 describe('withNano()', () => {

});

 @Test
 it('test_withNanoOfSecond_normal', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withNano(15);
     assertEquals(test, ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500.withNano(15), ZONE_0100));
 });

 @Test
 it('test_withNanoOfSecond_noChange', () => {
     var base = ZonedDateTime.of(TEST_LOCAL_2008_06_30_11_30_59_500, ZONE_0100);
     var test = base.withNano(500);
     assertEquals(test, base);
 });

 //-----------------------------------------------------------------------
 // plus/minus
 //-----------------------------------------------------------------------
 @DataProvider(name="plusDays")
 Object[][] data_plusDays() {
     return new Object[][] {
         // normal
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), 0, dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), 1, dateTime(2008, 7, 1, 23, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), -1, dateTime(2008, 6, 29, 23, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         // skip over gap
         {dateTime(2008, 3, 30, 1, 30, 0, 0, OFFSET_0100, ZONE_PARIS), 1, dateTime(2008, 3, 31, 1, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         {dateTime(2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS), -1, dateTime(2008, 3, 29, 3, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         // land in gap
         {dateTime(2008, 3, 29, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS), 1, dateTime(2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         {dateTime(2008, 3, 31, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS), -1, dateTime(2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         // skip over overlap
         {dateTime(2008, 10, 26, 1, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 1, dateTime(2008, 10, 27, 1, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         {dateTime(2008, 10, 25, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 1, dateTime(2008, 10, 26, 3, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         // land in overlap
         {dateTime(2008, 10, 25, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 1, dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         {dateTime(2008, 10, 27, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS), -1, dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
     };
 }

 @DataProvider(name="plusTime")
 Object[][] data_plusTime() {
     return new Object[][] {
         // normal
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), 0, dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), 1, dateTime(2008, 7, 1, 0, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         {dateTime(2008, 6, 30, 23, 30, 59, 0, OFFSET_0100, ZONE_0100), -1, dateTime(2008, 6, 30, 22, 30, 59, 0, OFFSET_0100, ZONE_0100)},
         // gap
         {dateTime(2008, 3, 30, 1, 30, 0, 0, OFFSET_0100, ZONE_PARIS), 1, dateTime(2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         {dateTime(2008, 3, 30, 3, 30, 0, 0, OFFSET_0200, ZONE_PARIS), -1, dateTime(2008, 3, 30, 1, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         // overlap
         {dateTime(2008, 10, 26, 1, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 1, dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS)},
         {dateTime(2008, 10, 26, 1, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 2, dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         {dateTime(2008, 10, 26, 1, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 3, dateTime(2008, 10, 26, 3, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         {dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 1, dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
         {dateTime(2008, 10, 26, 2, 30, 0, 0, OFFSET_0200, ZONE_PARIS), 2, dateTime(2008, 10, 26, 3, 30, 0, 0, OFFSET_0100, ZONE_PARIS)},
     };
 }

 describe('plus(adjuster)', () => {

});

 @Test(dataProvider="plusDays")
 public void test_plus_adjuster_Period_days(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(Period.ofDays((int) amount)), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_plus_adjuster_Period_hours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(Duration.ofHours(amount)), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_plus_adjuster_Duration_hours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(Duration.ofHours(amount)), expected);
 }

 @Test
 it('test_plus_adjuster', () => {
     var period = MockSimplePeriod.of(7, ChronoUnit.MONTHS);
     var t = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 12, 30, 59, 500), ZONE_0100);
     var expected = ZonedDateTime.of(LocalDateTime.of(2009, 1, 1, 12, 30, 59, 500), ZONE_0100);
     assertEquals(t.plus(period), expected);
 });

 @Test
 it('test_plus_adjuster_Duration', () => {
     var duration = Duration.ofSeconds(4 * 60 * 60 + 5 * 60 + 6);
     var t = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 12, 30, 59, 500), ZONE_0100);
     var expected = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 16, 36, 5, 500), ZONE_0100);
     assertEquals(t.plus(duration), expected);
 });

 @Test
 it('test_plus_adjuster_Period_zero', () => {
     var t = TEST_DATE_TIME.plus(MockSimplePeriod.ZERO_DAYS);
     assertEquals(t, TEST_DATE_TIME);
 });

 @Test
 it('test_plus_adjuster_Duration_zero', () => {
     var t = TEST_DATE_TIME.plus(Duration.ZERO);
     assertEquals(t, TEST_DATE_TIME);
 });

 it('test_plus_adjuster_null', () => {
expect(() => {
     TEST_DATE_TIME.plus(null);
 
}).to.throw(NullPointerException);
});

 //-----------------------------------------------------------------------
 // plus(long,PeriodUnit)
 //-----------------------------------------------------------------------
 @Test(dataProvider="plusTime")
 public void test_plus_longUnit_hours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(amount, HOURS), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_plus_longUnit_minutes(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(amount * 60, MINUTES), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_plus_longUnit_seconds(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(amount * 3600, SECONDS), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_plus_longUnit_nanos(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plus(amount * 3600000000000, NANOS), expected);
 }

 it('test_plus_longUnit_null', () => {
expect(() => {
     TEST_DATE_TIME_PARIS.plus(0, null);
 
}).to.throw(NullPointerException);
});

 describe('plusYears()', () => {

});

 @Test
 it('test_plusYears', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusYears(1);
     assertEquals(test, ZonedDateTime.of(ldt.plusYears(1), ZONE_0100));
 });

 @Test
 it('test_plusYears_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusYears(0);
     assertEquals(test, base);
 });

 describe('plusMonths()', () => {

});

 @Test
 it('test_plusMonths', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusMonths(1);
     assertEquals(test, ZonedDateTime.of(ldt.plusMonths(1), ZONE_0100));
 });

 @Test
 it('test_plusMonths_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusMonths(0);
     assertEquals(test, base);
 });

 describe('plusWeeks()', () => {

});

 @Test
 it('test_plusWeeks', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusWeeks(1);
     assertEquals(test, ZonedDateTime.of(ldt.plusWeeks(1), ZONE_0100));
 });

 @Test
 it('test_plusWeeks_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusWeeks(0);
     assertEquals(test, base);
 });

 describe('plusDays()', () => {

});

 @Test(dataProvider="plusDays")
 public void test_plusDays(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plusDays(amount), expected);
 }

 describe('plusHours()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_plusHours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plusHours(amount), expected);
 }

 describe('plusMinutes()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_plusMinutes(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plusMinutes(amount * 60), expected);
 }

 @Test
 it('test_plusMinutes_minutes', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusMinutes(30);
     assertEquals(test, ZonedDateTime.of(ldt.plusMinutes(30), ZONE_0100));
 });

 describe('plusSeconds()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_plusSeconds(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plusSeconds(amount * 3600), expected);
 }

 @Test
 it('test_plusSeconds_seconds', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusSeconds(1);
     assertEquals(test, ZonedDateTime.of(ldt.plusSeconds(1), ZONE_0100));
 });

 describe('plusNanos()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_plusNanos(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.plusNanos(amount * 3600000000000), expected);
 }

 @Test
 it('test_plusNanos_nanos', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.plusNanos(1);
     assertEquals(test, ZonedDateTime.of(ldt.plusNanos(1), ZONE_0100));
 });

 describe('minus(adjuster)', () => {

});

 @Test(dataProvider="plusDays")
 public void test_minus_adjuster_Period_days(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minus(Period.ofDays((int) -amount)), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_minus_adjuster_Period_hours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minus(Duration.ofHours(-amount)), expected);
 }

 @Test(dataProvider="plusTime")
 public void test_minus_adjuster_Duration_hours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minus(Duration.ofHours(-amount)), expected);
 }

 @Test
 it('test_minus_adjuster', () => {
     var period = MockSimplePeriod.of(7, ChronoUnit.MONTHS);
     var t = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 12, 30, 59, 500), ZONE_0100);
     var expected = ZonedDateTime.of(LocalDateTime.of(2007, 11, 1, 12, 30, 59, 500), ZONE_0100);
     assertEquals(t.minus(period), expected);
 });

 @Test
 it('test_minus_adjuster_Duration', () => {
     var duration = Duration.ofSeconds(4 * 60 * 60 + 5 * 60 + 6);
     var t = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 12, 30, 59, 500), ZONE_0100);
     var expected = ZonedDateTime.of(LocalDateTime.of(2008, 6, 1, 8, 25, 53, 500), ZONE_0100);
     assertEquals(t.minus(duration), expected);
 });

 @Test
 it('test_minus_adjuster_Period_zero', () => {
     var t = TEST_DATE_TIME.minus(MockSimplePeriod.ZERO_DAYS);
     assertEquals(t, TEST_DATE_TIME);
 });

 @Test
 it('test_minus_adjuster_Duration_zero', () => {
     var t = TEST_DATE_TIME.minus(Duration.ZERO);
     assertEquals(t, TEST_DATE_TIME);
 });

 it('test_minus_adjuster_null', () => {
expect(() => {
     TEST_DATE_TIME.minus(null);
 
}).to.throw(NullPointerException);
});

 describe('minusYears()', () => {

});

 @Test
 it('test_minusYears', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusYears(1);
     assertEquals(test, ZonedDateTime.of(ldt.minusYears(1), ZONE_0100));
 });

 @Test
 it('test_minusYears_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusYears(0);
     assertEquals(test, base);
 });

 describe('minusMonths()', () => {

});

 @Test
 it('test_minusMonths', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusMonths(1);
     assertEquals(test, ZonedDateTime.of(ldt.minusMonths(1), ZONE_0100));
 });

 @Test
 it('test_minusMonths_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusMonths(0);
     assertEquals(test, base);
 });

 describe('minusWeeks()', () => {

});

 @Test
 it('test_minusWeeks', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusWeeks(1);
     assertEquals(test, ZonedDateTime.of(ldt.minusWeeks(1), ZONE_0100));
 });

 @Test
 it('test_minusWeeks_zero', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusWeeks(0);
     assertEquals(test, base);
 });

 describe('minusDays()', () => {

});

 @Test(dataProvider="plusDays")
 public void test_minusDays(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minusDays(-amount), expected);
 }

 describe('minusHours()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_minusHours(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minusHours(-amount), expected);
 }

 describe('minusMinutes()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_minusMinutes(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minusMinutes(-amount * 60), expected);
 }

 @Test
 it('test_minusMinutes_minutes', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusMinutes(30);
     assertEquals(test, ZonedDateTime.of(ldt.minusMinutes(30), ZONE_0100));
 });

 describe('minusSeconds()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_minusSeconds(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minusSeconds(-amount * 3600), expected);
 }

 @Test
 it('test_minusSeconds_seconds', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusSeconds(1);
     assertEquals(test, ZonedDateTime.of(ldt.minusSeconds(1), ZONE_0100));
 });

 describe('minusNanos()', () => {

});

 @Test(dataProvider="plusTime")
 public void test_minusNanos(ZonedDateTime base, long amount, ZonedDateTime expected) {
     assertEquals(base.minusNanos(-amount * 3600000000000), expected);
 }

 @Test
 it('test_minusNanos_nanos', () => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var base = ZonedDateTime.of(ldt, ZONE_0100);
     var test = base.minusNanos(1);
     assertEquals(test, ZonedDateTime.of(ldt.minusNanos(1), ZONE_0100));
 });

 describe('toInstant()', () => {

});

 @DataProvider(name="toInstant")
 Object[][] data_toInstant() {
     return new Object[][] {
         {LocalDateTime.of(1970, 1, 1, 0, 0, 0, 0), 0, 0},
         {LocalDateTime.of(1970, 1, 1, 0, 0, 0, 1), 0, 1},
         {LocalDateTime.of(1970, 1, 1, 0, 0, 0, 999999999), 0, 999999999},
         {LocalDateTime.of(1970, 1, 1, 0, 0, 1, 0), 1, 0},
         {LocalDateTime.of(1970, 1, 1, 0, 0, 1, 1), 1, 1},
         {LocalDateTime.of(1969, 12, 31, 23, 59, 59, 999999999), -1, 999999999},
         {LocalDateTime.of(1970, 1, 2, 0, 0), 24 * 60 * 60, 0},
         {LocalDateTime.of(1969, 12, 31, 0, 0), -24 * 60 * 60, 0},
     };
 }

 @Test(dataProvider="toInstant")
 public void test_toInstant_UTC(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZoneOffset.UTC);
     var test = dt.toInstant();
     assertEquals(test.epochsecond(), expectedEpSec);
     assertEquals(test.nano(), expectedNos);
 }

 @Test(dataProvider="toInstant")
 public void test_toInstant_P0100(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZONE_0100);
     var test = dt.toInstant();
     assertEquals(test.epochsecond(), expectedEpSec - 3600);
     assertEquals(test.nano(), expectedNos);
 }

 @Test(dataProvider="toInstant")
 public void test_toInstant_M0100(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZONE_M0100);
     var test = dt.toInstant();
     assertEquals(test.epochsecond(), expectedEpSec + 3600);
     assertEquals(test.nano(), expectedNos);
 }

 describe('toEpochSecond()', () => {

});

 @Test
 public void test_toEpochSecond_afterEpoch() {
     var ldt = LocalDateTime.of(1970, 1, 1, 0, 0).plusHours(1);
     for (var i = 0; i < 100000; i++) {
         var a = ZonedDateTime.of(ldt, ZONE_PARIS);
         assertEquals(a.toEpochSecond(), i);
         ldt = ldt.plusSeconds(1);
     }
 }

 @Test
 public void test_toEpochSecond_beforeEpoch() {
     var ldt = LocalDateTime.of(1970, 1, 1, 0, 0).plusHours(1);
     for (var i = 0; i < 100000; i++) {
         var a = ZonedDateTime.of(ldt, ZONE_PARIS);
         assertEquals(a.toEpochSecond(), -i);
         ldt = ldt.minusSeconds(1);
     }
 }

 @Test(dataProvider="toInstant")
 public void test_toEpochSecond_UTC(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZoneOffset.UTC);
     assertEquals(dt.toEpochSecond(), expectedEpSec);
 }

 @Test(dataProvider="toInstant")
 public void test_toEpochSecond_P0100(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZONE_0100);
     assertEquals(dt.toEpochSecond(), expectedEpSec - 3600);
 }

 @Test(dataProvider="toInstant")
 public void test_toEpochSecond_M0100(LocalDateTime ldt, long expectedEpSec, int expectedNos) {
     var dt = ldt.atZone(ZONE_M0100);
     assertEquals(dt.toEpochSecond(), expectedEpSec + 3600);
 }

 describe('compareTo()', () => {

});

 @Test
 public void test_compareTo_time1() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 39), ZONE_0100);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 41), ZONE_0100);  // a is before b due to time
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_time2() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 40, 4), ZONE_0100);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 40, 5), ZONE_0100);  // a is before b due to time
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_offset1() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 41), ZONE_0200);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 39), ZONE_0100);  // a is before b due to offset
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_offset2() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 40, 5), ZoneId.of("UTC+01:01"));
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 30, 40, 4), ZONE_0100);  // a is before b due to offset
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_both() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 50), ZONE_0200);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 20), ZONE_0100);  // a is before b on instant scale
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_bothNanos() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 20, 40, 5), ZONE_0200);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 10, 20, 40, 6), ZONE_0100);  // a is before b on instant scale
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 @Test
 public void test_compareTo_hourDifference() {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 10, 0), ZONE_0100);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, 11, 0), ZONE_0200);  // a is before b despite being same time-line time
     assertEquals(a.compareTo(b) < 0, true);
     assertEquals(b.compareTo(a) > 0, true);
     assertEquals(a.compareTo(a) == 0, true);
     assertEquals(b.compareTo(b) == 0, true);
 }

 it('test_compareTo_null', () => {
expect(() => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var a = ZonedDateTime.of(ldt, ZONE_0100);
     a.compareTo(null);
 
}).to.throw(NullPointerException);
});

 describe('isBefore()', () => {

});

 @DataProvider(name="IsBefore")
 Object[][] data_isBefore() {
     return new Object[][] {
         {11, 30, ZONE_0100, 11, 31, ZONE_0100, true}, // a is before b due to time
         {11, 30, ZONE_0200, 11, 30, ZONE_0100, true}, // a is before b due to offset
         {11, 30, ZONE_0200, 10, 30, ZONE_0100, false}, // a is equal b due to same instant
     };
 }

 @Test(dataProvider="IsBefore")
 public void test_isBefore(int hour1, int minute1, ZoneId zone1, int hour2, int minute2, ZoneId zone2, boolean expected) {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, hour1, minute1), zone1);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, hour2, minute2), zone2);
     assertEquals(a.isBefore(b), expected);
     assertEquals(b.isBefore(a), false);
     assertEquals(a.isBefore(a), false);
     assertEquals(b.isBefore(b), false);
 }

 it('test_isBefore_null', () => {
expect(() => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var a = ZonedDateTime.of(ldt, ZONE_0100);
     a.isBefore(null);
 
}).to.throw(NullPointerException);
});

 describe('isAfter()', () => {

});

 @DataProvider(name="IsAfter")
 Object[][] data_isAfter() {
     return new Object[][] {
         {11, 31, ZONE_0100, 11, 30, ZONE_0100, true}, // a is after b due to time
         {11, 30, ZONE_0100, 11, 30, ZONE_0200, true}, // a is after b due to offset
         {11, 30, ZONE_0200, 10, 30, ZONE_0100, false}, // a is equal b due to same instant
     };
 }

 @Test(dataProvider="IsAfter")
 public void test_isAfter(int hour1, int minute1, ZoneId zone1, int hour2, int minute2, ZoneId zone2, boolean expected) {
     var a = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, hour1, minute1), zone1);
     var b = ZonedDateTime.of(LocalDateTime.of(2008, 6, 30, hour2, minute2), zone2);
     assertEquals(a.isAfter(b), expected);
     assertEquals(b.isAfter(a), false);
     assertEquals(a.isAfter(a), false);
     assertEquals(b.isAfter(b), false);
 }

 it('test_isAfter_null', () => {
expect(() => {
     var ldt = LocalDateTime.of(2008, 6, 30, 23, 30, 59, 0);
     var a = ZonedDateTime.of(ldt, ZONE_0100);
     a.isAfter(null);
 
}).to.throw(NullPointerException);
});

 //-----------------------------------------------------------------------
 // equals() / hashCode()
 //-----------------------------------------------------------------------
 @Test(dataProvider="sampleTimes")
 public void test_equals_true(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     assertEquals(a.equals(b), true);
     assertEquals(a.hashCode() == b.hashCode(), true);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_year_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y + 1, o, d, h, m, s, n), ZONE_0100);
     assertEquals(a.equals(b), false);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_hour_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     h = (h == 23 ? 22 : h);
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h + 1, m, s, n), ZONE_0100);
     assertEquals(a.equals(b), false);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_minute_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     m = (m == 59 ? 58 : m);
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h, m + 1, s, n), ZONE_0100);
     assertEquals(a.equals(b), false);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_second_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     s = (s == 59 ? 58 : s);
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h, m, s + 1, n), ZONE_0100);
     assertEquals(a.equals(b), false);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_nano_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     n = (n == 999999999 ? 999999998 : n);
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n + 1), ZONE_0100);
     assertEquals(a.equals(b), false);
 }
 @Test(dataProvider="sampleTimes")
 public void test_equals_false_offset_differs(int y, int o, int d, int h, int m, int s, int n, ZoneId ignored) {
     var a = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0100);
     var b = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZONE_0200);
     assertEquals(a.equals(b), false);
 }

 @Test
 it('test_equals_itself_true', () => {
     assertEquals(TEST_DATE_TIME.equals(TEST_DATE_TIME), true);
 });

 @Test
 public void test_equals_string_false() {
     assertEquals(TEST_DATE_TIME.equals("2007-07-15"), false);
 }

 describe('toString()', () => {

});

 @DataProvider(name="sampleToString")
 Object[][] provider_sampleToString() {
     return new Object[][] {
         {2008, 6, 30, 11, 30, 59, 0, "Z", "2008-06-30T11:30:59Z"},
         {2008, 6, 30, 11, 30, 59, 0, "+01:00", "2008-06-30T11:30:59+01:00"},
         {2008, 6, 30, 11, 30, 59, 999000000, "Z", "2008-06-30T11:30:59.999Z"},
         {2008, 6, 30, 11, 30, 59, 999000000, "+01:00", "2008-06-30T11:30:59.999+01:00"},
         {2008, 6, 30, 11, 30, 59, 999000, "Z", "2008-06-30T11:30:59.000999Z"},
         {2008, 6, 30, 11, 30, 59, 999000, "+01:00", "2008-06-30T11:30:59.000999+01:00"},
         {2008, 6, 30, 11, 30, 59, 999, "Z", "2008-06-30T11:30:59.000000999Z"},
         {2008, 6, 30, 11, 30, 59, 999, "+01:00", "2008-06-30T11:30:59.000000999+01:00"},

         {2008, 6, 30, 11, 30, 59, 999, "Europe/London", "2008-06-30T11:30:59.000000999+01:00[Europe/London]"},
         {2008, 6, 30, 11, 30, 59, 999, "Europe/Paris", "2008-06-30T11:30:59.000000999+02:00[Europe/Paris]"},
     };
 }

 @Test(dataProvider="sampleToString")
 public void test_toString(int y, int o, int d, int h, int m, int s, int n, String zoneId, String expected) {
     var t = ZonedDateTime.of(dateTime(y, o, d, h, m, s, n), ZoneId.of(zoneId));
     var str = t.toString();
     assertEquals(str, expected);
 }

 describe('format(DateTimeFormatter)', () => {

});

 @Test
 public void test_format_formatter() {
     var f = DateTimeFormatter.ofPattern("y M d H m s");
     var t = ZonedDateTime.of(dateTime(2010, 12, 3, 11, 30), ZONE_PARIS).format(f);
     assertEquals(t, "2010 12 3 11 30 0");
 }

 it('test_format_formatter_null', () => {
expect(() => {
     ZonedDateTime.of(dateTime(2010, 12, 3, 11, 30), ZONE_PARIS).format(null);
 
}).to.throw(NullPointerException);
});

 //-------------------------------------------------------------------------
 private static LocalDateTime dateTime(
         int year, int month, int dayOfMonth,
         int hour, int minute) {
     return LocalDateTime.of(year, month, dayOfMonth, hour, minute);
 }

 private static LocalDateTime dateTime(
                 int year, int month, int dayOfMonth,
                 int hour, int minute, int second, int nanoOfSecond) {
             return LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond);
         }

 private static ZonedDateTime dateTime(
         int year, int month, int dayOfMonth,
         int hour, int minute, int second, int nanoOfSecond, ZoneOffset offset, ZoneId zoneId) {
     return ZonedDateTime.ofStrict(LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, nanoOfSecond), offset, zoneId);
 }

}

 */