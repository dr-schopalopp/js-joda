/**
 * @copyright (c) 2016, Philipp Thuerwaechter & Pattrick Hueper
 * @copyright (c) 2007-present, Stephen Colebourne & Michael Nascimento Santos
 * @license BSD-3-Clause (see LICENSE in the root directory of this source tree)
 */
import {MAX_SAFE_INTEGER, MIN_SAFE_INTEGER} from '../MathUtil';
import {ChronoUnit} from './ChronoUnit';
import { TemporalField } from './TemporalField';
import { ValueRange } from './ValueRange';
import {Year} from '../Year';

export class ChronoField extends TemporalField {

    constructor(name, baseUnit, rangeUnit, range) {
        super();
        this._name = name;
        this._baseUnit = baseUnit;
        this._rangeUnit = rangeUnit;
        this._range = range;
    }        

    name(){
        return this._name;    
    }
    
    baseUnit(){
        return this._baseUnit;    
    }
    
    rangeUnit(){
        return this._rangeUnit;    
    }
    
    range(){
        return this._range;    
    }
    
    displayName(){
        return this.toString();    
    }
    
    checkValidValue(value) {
        return this.range().checkValidValue(value, this.name());
    }

    /**
     * Checks if this field represents a component of a date.
     *
     * @return true if it is a component of a date
     */
    isDateBased() {
        var dateBased =
            //this === ChronoField.DAY_OF_WEEK ||
            //this === ChronoField.ALIGNED_DAY_OF_WEEK_IN_MONTH ||
            //this === ChronoField.ALIGNED_DAY_OF_WEEK_IN_YEAR ||
            this === ChronoField.DAY_OF_MONTH ||
            this === ChronoField.DAY_OF_YEAR ||
            this === ChronoField.EPOCH_DAY ||
            //this === ChronoField.ALIGNED_WEEK_OF_MONTH ||
            //this === ChronoField.ALIGNED_WEEK_OF_YEAR ||
            this === ChronoField.MONTH_OF_YEAR ||
            //this === ChronoField.EPOCH_MONTH ||
            //this === ChronoField.YEAR_OF_ERA ||
            this === ChronoField.YEAR ||
            this === ChronoField.ERA;
        return dateBased;
    }

    /**
     * Get the range of valid values for this field using the temporal object to
     * refine the result.
     * <p>
     * This uses the temporal object to find the range of valid values for the field.
     * This is similar to {@link #range()}, however this method refines the result
     * using the temporal. For example, if the field is {@code DAY_OF_MONTH} the
     * {@code range} method is not accurate as there are four possible month lengths,
     * 28, 29, 30 and 31 days. Using this method with a date allows the range to be
     * accurate, returning just one of those four options.
     * <p>
     * There are two equivalent ways of using this method.
     * The first is to invoke this method directly.
     * The second is to use {@link TemporalAccessor#range(TemporalField)}:
     * <pre>
     *   // these two lines are equivalent, but the second approach is recommended
     *   temporal = thisField.rangeRefinedBy(temporal);
     *   temporal = temporal.range(thisField);
     * </pre>
     * It is recommended to use the second approach, {@code range(TemporalField)},
     * as it is a lot clearer to read in code.
     * <p>
     * Implementations should perform any queries or calculations using the fields
     * available in {@link ChronoField}.
     * If the field is not supported a {@code DateTimeException} must be thrown.
     *
     * @param {TemporalAccessor} temporal  the temporal object used to refine the result, not null
     * @return {Va;lueRange} the range of valid values for this field, not null
     * @throws DateTimeException if the range for the field cannot be obtained
     */
    rangeRefinedBy(temporal) {
        return temporal.range(this);
    }

    /**
     * Checks that the specified value is valid and fits in an {@code int}.
     * <p>
     * This validates that the value is within the outer range of valid values
     * returned by {@link #range()}.
     * It also checks that all valid values are within the bounds of an {@code int}.
     * <p>
     * This method checks against the range of the field in the ISO-8601 calendar system.
     * This range may be incorrect for other calendar systems.
     * Use {@link Chronology#range(ChronoField)} to access the correct range
     * for a different calendar system.
     *
     * @param value  the value to check
     * @return the value that was passed in
     */
    checkValidIntValue(value) {
        return this.range().checkValidIntValue(value, this);
    }

    getFrom(temporal) {
        return temporal.getLong(this);
    }

    toString(){
        return this.name();
    }

    equals(other){
        return this === other;
    }
}

ChronoField.NANO_OF_SECOND = new ChronoField('NanoOfSecond', ChronoUnit.NANOS, ChronoUnit.SECONDS, ValueRange.of(0, 999999999));

ChronoField.NANO_OF_DAY = new ChronoField('NanoOfDay', ChronoUnit.NANOS, ChronoUnit.DAYS, ValueRange.of(0, 86400 * 1000000000 - 1));

ChronoField.MICRO_OF_SECOND = new ChronoField('MicroOfSecond', ChronoUnit.MICROS, ChronoUnit.SECONDS, ValueRange.of(0, 999999));

ChronoField.MILLI_OF_SECOND = new ChronoField('MilliOfSecond', ChronoUnit.MILLIS, ChronoUnit.SECONDS, ValueRange.of(0, 999));

ChronoField.HOUR_OF_DAY = new ChronoField('HourOfDay', ChronoUnit.HOURS, ChronoUnit.DAYS, ValueRange.of(0, 23));

ChronoField.DAY_OF_WEEK = new ChronoField('DayOfWeek', ChronoUnit.DAYS, ChronoUnit.WEEKS, ValueRange.of(1, 7));

ChronoField.ALIGNED_DAY_OF_WEEK_IN_MONTH = new ChronoField('AlignedDayOfWeekInMonth', ChronoUnit.DAYS, ChronoUnit.WEEKS, ValueRange.of(1, 7));

ChronoField.ALIGNED_DAY_OF_WEEK_IN_YEAR = new ChronoField('AlignedDayOfWeekInYear', ChronoUnit.DAYS, ChronoUnit.WEEKS, ValueRange.of(1, 7));

ChronoField.DAY_OF_MONTH = new ChronoField('DayOfMonth', ChronoUnit.DAYS, ChronoUnit.MONTHS, ValueRange.of(1, 28, 31), 'day');

ChronoField.DAY_OF_YEAR = new ChronoField('DayOfYear', ChronoUnit.DAYS, ChronoUnit.YEARS, ValueRange.of(1, 365, 366));

ChronoField.EPOCH_DAY = new ChronoField('EpochDay', ChronoUnit.DAYS, ChronoUnit.FOREVER, ValueRange.of(Math.floor(Year.MIN_VALUE * 365.25), Math.floor(Year.MAX_VALUE * 365.25)));

ChronoField.ALIGNED_WEEK_OF_MONTH = new ChronoField('AlignedWeekOfMonth', ChronoUnit.WEEKS, ChronoUnit.MONTHS, ValueRange.of(1, 4, 5));

ChronoField.ALIGNED_WEEK_OF_YEAR = new ChronoField('AlignedWeekOfYear', ChronoUnit.WEEKS, ChronoUnit.YEARS, ValueRange.of(1, 53));

ChronoField.MONTH_OF_YEAR = new ChronoField('MonthOfYear', ChronoUnit.MONTHS, ChronoUnit.YEARS, ValueRange.of(1, 12), 'month');

ChronoField.PROLEPTIC_MONTH = new ChronoField('ProlepticMonth', ChronoUnit.MONTHS, ChronoUnit.FOREVER, ValueRange.of(Year.MIN_VALUE * 12, Year.MAX_VALUE * 12 + 11));

ChronoField.YEAR_OF_ERA = new ChronoField('YearOfEra', ChronoUnit.YEARS, ChronoUnit.FOREVER, ValueRange.of(1, Year.MAX_VALUE, Year.MAX_VALUE + 1));

ChronoField.YEAR = new ChronoField('Year', ChronoUnit.YEARS, ChronoUnit.FOREVER, ValueRange.of(Year.MIN_VALUE, Year.MAX_VALUE), 'year');

ChronoField.ERA = new ChronoField('Era', ChronoUnit.ERAS, ChronoUnit.FOREVER, ValueRange.of(0, 1));

ChronoField.INSTANT_SECONDS = new ChronoField('InstantSeconds', ChronoUnit.SECONDS, ChronoUnit.FOREVER, ValueRange.of(MIN_SAFE_INTEGER, MAX_SAFE_INTEGER));

ChronoField.OFFSET_SECONDS = new ChronoField('OffsetSeconds', ChronoUnit.SECONDS, ChronoUnit.FOREVER, ValueRange.of(-18 * 3600, 18 * 3600));


