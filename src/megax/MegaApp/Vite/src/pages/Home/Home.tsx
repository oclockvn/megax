import { useAppDispatch, useAppSelector } from "../../store/store.hook";
import { useEffect } from "react";
import { getWeatherForecastThunk } from "../../store/home.slice";

function HomePage() {
  const forecastItems = useAppSelector(s => s.homeSlice.items);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(getWeatherForecastThunk());
  }, []);

  return (
    <>
      {forecastItems &&
        forecastItems.map((i, index) => (
          <>
            <div key={index}>
              {i.date} - {i.temperatureC} - {i.summary}
            </div>
          </>
        ))}
      User HomePage
    </>
  );
}

export default HomePage;
