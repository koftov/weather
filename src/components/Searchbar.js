import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Search, Label } from "semantic-ui-react";
import { getLocations } from "../services/services";
import { toast, ToastContainer } from "react-toastify";
import { getCityForecast } from "../actions/cityForecastActions";

function Searchbar() {
  const dispatch = useDispatch();
  const [cityOptions, setCityOptions] = useState([]);
  const [value, setValue] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getCities = async () => {
      setLoading(true);
      try {
        const data = await getLocations(value);
        setCityOptions(
          data &&
            data.map((item) => ({
              description: item.LocalizedName,
              title: item.Key,
            }))
        );
      } catch (err) {
        toast(err.message);
      }
      setLoading(false);
    };

    getCities();
  }, [value]);

  const selectCity = (data) => {
    dispatch(getCityForecast(data.result.title, data.result.description));
    setValue(data.result.description);
  };

  const resultRenderer = ({ description }) => <Label content={description} />;

  return (
    <>
      <Search
        fluid
        loading={isLoading}
        onResultSelect={(e, data) => selectCity(data)}
        onSearchChange={(e) => setValue(e.target.value)}
        resultRenderer={resultRenderer}
        results={cityOptions && cityOptions}
        value={value}
      />
      <ToastContainer />
    </>
  );
}

export default Searchbar;
