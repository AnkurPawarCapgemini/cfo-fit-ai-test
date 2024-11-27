import React from "react";
import Slider from "react-slick"; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import Chart from "../chatResponse/chart/chart";
import Table from "../chatResponse/table/table";

const SliderComponent = ({ data, slidesToShow = 1, slidesToScroll = 1 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    adaptiveHeight: true,
    arrows: true,
  };

  const botMessages =
    data?.[0]?.messages?.filter((message) => message.role === "bot") || [];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {botMessages.length > 0 ? (
          botMessages.map((message, index) =>
            message.content?.map((contentItem, i) => {
              switch (contentItem.type) {
                case "chart":
                  return (
                    <div key={`chart-${index}-${i}`} className="slider-item">
                      <Chart chartData={contentItem.data} />
                    </div>
                  );
                case "table": {
                  const tableData = contentItem.data || [];
                  return (
                    <div key={`table-${index}-${i}`} className="slider-item">
                      {tableData?.data?.length > 0 ? (
                        <Table tableData={tableData} />
                      ) : (
                        <p>No data available for the table</p>
                      )}
                    </div>
                  );
                }
                case "text":
                  return (
                    <div key={`text-${index}-${i}`} className="slider-item">
                      <p>{contentItem.data || "No text data available"}</p>
                    </div>
                  );
                default:
                  return null;
              }
            })
          )
        ) : (
          <p>No bot messages available</p>
        )}
      </Slider>
    </div>
  );
};

export default SliderComponent;
