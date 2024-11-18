import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import StockChart from "../components/Chart/index";
import TradingViewWidget from "../components/Chart/TradingView";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const Result = () => {
  const [status, setStatus] = useState("Offline");
  const location = useLocation();
  const { tickerSymbol } = (location.state || {});
//   console.log(tickerSymbol); 

  const [date, setDate] = useState([]);
  const [closePrice, setClosePrice] = useState([]);
  const [testDate, setTestDate] = useState([]);
  const [testClosePrice, setTestClosePrice] = useState([]);
  const [trainDate, setTrainDate] = useState([]);
  const [trainClosePrice, setTrainClosePrice] = useState([]);
  const [predictionDate, setPredictionDate] = useState([]);
  const [predictionClosePrice, setPredictionClosePrice] = useState([]);
  const [trainAccuracy, setTrainAccuracy] = useState([]);
  const [testAccuracy, setTestAccuracy] = useState([]);
  const [trainMSE, setTrainMSE] = useState([]);
  const [testMSE, setTestMSE] = useState([]);
  const [trainRMSE, setTrainRMSE] = useState([]);
  const [testRMSE, setTestRMSE] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  axios.defaults.baseURL = "http://127.0.0.1:5000";

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/status");
      setStatus(result.data.status);
    }
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const formattedDate = [year, month, day];

    // Prepare data to send
    const data = { tickerSymbol, targetDate: formattedDate };

    setLoading(true);

    // Make the request
    axios
      .post("http://127.0.0.1:5000/submit", data)
      .then((response) => {
        console.log("Response Data : ", response.data);
        setData(response.data); // Set data
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Stop loading if there's an error
      });
  };

  const setData = (data) => {
    setDate(data.data.date);
    setClosePrice(data.data.close);
    setTrainDate(data.train.date);
    setTrainClosePrice(data.train.close);
    setTestDate(data.test.date);
    setTestClosePrice(data.test.close);
    setPredictionDate(data.prediction.date);
    setPredictionClosePrice(data.prediction.close);
    setTrainAccuracy(data.train_accuracy);
    setTestAccuracy(data.test_accuracy);
    setTrainMSE(data.train_mse);
    setTestMSE(data.test_mse);
    setTrainRMSE(data.train_rmse);
    setTestRMSE(data.test_rmse);

    // Check if all necessary data is available to show
    if (
      data.data.date &&
      data.data.close &&
      data.test.date &&
      data.test.close &&
      data.train.date &&
      data.train.close &&
      data.prediction.date &&
      data.prediction.close
    ) {
      setReady(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="p-4 mt-4">
          {status === "Online" ? (
            <div className="border-2 border-teal-500 text-teal-500 font-bold rounded-full px-3 py-0 flex justify-center items-center gap-2 top">
              <div className="w-3 h-3 bg-teal-500 flex rounded-full"></div>
              {status}
            </div>
          ) : (
            <div className="border-2 border-red-500 text-red-500 font-bold rounded-full px-3 py-0 flex justify-center items-center gap-2 mt-4">
              <div className="w-3 h-3 bg-red-500 flex rounded-full"></div>
              {status}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-full gap-20">
          <div>
            <h1 className="text-4xl my-4 text-slate-600 font-bold text-center">
              Stock Price Predictor
            </h1>
            <div className={`flex flex-col items-center w-full gap-20 form-container p-7`}>
              <form className="flex gap-3" onSubmit={handleSubmit} method="POST">
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading && (
                    <CircularProgress
                      size={20}
                      thickness={5}
                      sx={{ marginRight: ".75rem" }}
                      color={"inherit"}
                    />
                  )}
                  Forecast
                </Button>
              </form>
            </div>
          </div>

          <TradingViewWidget />

          {ready && (
            <>
              <div
                id="chart-container"
                className="flex flex-col w-full px-4 md:px-12 lg:px-32"
              >
                <p className="mb-3 font-medium text-slate-600 text-3xl text-center p-4">
                  {tickerSymbol} Stock Prediction
                </p>
                <StockChart
                  date={date}
                  close={closePrice}
                  ticker={tickerSymbol}
                  trainDate={trainDate}
                  trainClose={trainClosePrice}
                  testDate={testDate}
                  testClose={testClosePrice}
                  predictionDate={predictionDate}
                  predictionClose={predictionClosePrice}
                  series="Trend"
                  title="Stock Trend"
                />
              </div>
              <div className="flex flex-col justify-between mb-20 w-full px-4 md:px-12 lg:px-32">
                <p className="text-2xl text-slate-600 font-medium text-center mb-4 p-4">
                  Statistics of the designed LSTM model
                </p>
                <table className="rounded-lg overflow-hidden table-auto min-w-full text-center font-medium">
                  <thead className="border-b bg-slate-600 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
                    <tr>
                      <th scope="col" className=" px-6 py-4">Statistics</th>
                      <th scope="col" className=" px-6 py-4">Training</th>
                      <th scope="col" className=" px-6 py-4">Testing</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-100">
                    <tr className="border-b dark:border-neutral-500">
                      <td className=" px-6 py-4">Accuracy</td>
                      <td className=" px-6 py-4">{trainAccuracy + " %"}</td>
                      <td className=" px-6 py-4 text-green-700">{testAccuracy + " %"}</td>
                    </tr>
                    <tr className="border-b dark:border-neutral-500">
                      <td className=" px-6 py-4">Mean Squared Error</td>
                      <td className=" px-6 py-4">{trainMSE}</td>
                      <td className=" px-6 py-4 text-green-700">{testMSE}</td>
                    </tr>
                    <tr>
                      <td className=" px-6 py-4">Root Mean Squared Error</td>
                      <td className=" px-6 py-4">{trainRMSE}</td>
                      <td className=" px-6 py-4 text-green-700">{testRMSE}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-400 text-sm mb-8 text-center">
                Fetched from backend server
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Result;
