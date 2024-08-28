import type { Schema, Attribute } from '@strapi/strapi';

export interface RatingRating extends Schema.Component {
  collectionName: 'components_rating_ratings';
  info: {
    displayName: 'Rating';
    icon: 'star';
    description: '';
  };
  attributes: {
    scheduleCompliance: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 5;
        },
        number
      >;
    resourceQuality: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 5;
        },
        number
      >;
    staffCourtesy: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 5;
        },
        number
      >;
    total: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 5;
        },
        number
      >;
    comments: Attribute.Text;
  };
}

export interface ScheduleSchedule extends Schema.Component {
  collectionName: 'components_schedule_schedules';
  info: {
    displayName: 'Schedule';
    icon: 'clock';
  };
  attributes: {
    dayOfWeek: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 6;
        },
        number
      >;
    startTime: Attribute.Time & Attribute.Required;
    endTime: Attribute.Time & Attribute.Required;
  };
}

export interface DetailsDetails extends Schema.Component {
  collectionName: 'components_details_details';
  info: {
    displayName: ' Details';
    icon: 'grid';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    description: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'rating.rating': RatingRating;
      'schedule.schedule': ScheduleSchedule;
      'details.details': DetailsDetails;
    }
  }
}
