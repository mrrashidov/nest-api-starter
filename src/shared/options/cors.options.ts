export const whiteList: RegExp[] = [/http:\/\/localhost:[0-9]{4}$/];
export const corsOptions: any = {
  origin: function (origin, callback) {
    if (!origin || whiteList.some((w) => origin.match(w))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};
