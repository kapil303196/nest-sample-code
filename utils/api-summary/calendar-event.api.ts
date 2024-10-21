import {
  PermissionsConstant,
  getPermissionDescription,
} from "../auth/constants/permissions";

export const CalendarEventApi = {
  save: {
    permissions: [PermissionsConstant.subscriberPhiAdmin],
    apiSummary: {
      summary:
        "The API is designed to add calendar event information for a given subscriber",
      description: getPermissionDescription([
        PermissionsConstant.subscriberPhiAdmin,
      ]),
    },
  },
  getById: {
    permissions: [PermissionsConstant.subscribersRead],
    apiSummary: {
      summary:
        "The API is designed to get the calendar event information using its unique identifier",
      description: getPermissionDescription([
        PermissionsConstant.subscribersRead,
      ]),
    },
  },
};
