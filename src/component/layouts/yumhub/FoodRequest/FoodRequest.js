import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faDollar,
  faMagnifyingGlass,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../buttons";
import classNames from "classnames/bind";
import styles from "./FoodRequest.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import ellipse from "../../../../assets/images/ellipse.png";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Tippy from "@tippyjs/react";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AccountItemFood from "../../../AccountItem/AccountFood/AccountFood";

const cx = classNames.bind(styles);

function FoodRequest() {
  const [tippyVisible, setTippyVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([]);
  const [detailFood, setDetailFood] = useState({});
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageBackground, setImageBackground] = useState("");
  const [nameFood, setNameFood] = useState("");
  const [priceFood, setPriceFood] = useState("");
  const [imageFood, setImageFood] = useState("");

  //load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post("/food/getFoodByStatus", {
          status: 1,
        });
        console.log(response.data.processingFood);
        setData(response.data.processingFood);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //set data
  useEffect(() => {
    setId(detailFood._id || "N/A");
    setName(detailFood.merchantID ? detailFood.merchantID.name : "N/A");
    setAddress(detailFood.merchantID ? detailFood.merchantID.address : "N/A");
    setImageBackground(
      detailFood.merchantID ? detailFood.merchantID.imageBackground : "N/A"
    );
    setNameFood(detailFood ? detailFood.nameFood : "N/A");
    setPriceFood(detailFood ? detailFood.price : "N/A");
    setImageFood(detailFood ? detailFood.image : "N/A");
  }, [detailFood]);

  const handleDetailFood = async (id) => {
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`food/getFoodById/?id=${id}`);
      setDetailFood(response.data.Foods);
      console.log(detailFood);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post("/food/findApproveFood", {
          keyword,
        });
        console.log(response.data);
        if (response.data.result && response.data.foods.length > 0) {
          setSearchResult(response.data.foods);
          setTippyVisible(true);
        } else {
          setSearchResult([]);
          setTippyVisible(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResult([]);
        setTippyVisible(false);
      }
    } else {
      setSearchResult([]);
      setTippyVisible(false);
    }
  };

  // xác nhận food request
  const handleApproval = async (id) => {
    try {
      const response = await AxiosInstance.post("food/Status", {
        ID: id,
        status: 3,
      });
      if (response.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Approval Failed",
          text: "There was an error updating the food!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Approval Successful",
          text: "The food has been successfully updated!",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // lọc ra food của từng merchant
  const groupByMerchant = (data) => {
    return data.reduce((acc, item) => { // acc là 1 {} rỗng
      const merchantId = item.merchantID._id;

      if (!acc[merchantId]) {
        acc[merchantId] = {
          merchant: item.merchantID,
          items: [],
        };
      }
      acc[merchantId].items.push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByMerchant(data);
  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>Stores Awaiting Approval</p>

        <div>
          <Tippy
            animation="fade"
            interactive
            placement="bottom"
            onClickOutside={handleClickOutSide}
            visible={tippyVisible}
            render={(attrs) => (
              <div tabIndex="-1" {...attrs} className={cx("search-result")}>
                {searchResult.length > 0 && (
                  <ProperWrapper>
                    <h4 className={cx("search-title")}>Accounts</h4>
                    {searchResult.length > 0
                      ? searchResult.map((food) => (
                          <AccountItemFood
                            key={food._id}
                            food={food}
                            handleView={handleDetailFood}
                          />
                        ))
                      : setTippyVisible(false)}
                  </ProperWrapper>
                )}
              </div>
            )}
          >
            <div className={cx("inputSearch")}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={cx("icon-search")}
              />
              <input
                className={cx("input")}
                placeholder="Search by name"
                onChange={handleSearch}
              />
            </div>
          </Tippy>
        </div>
        <div className={cx("line-background")} />
        {Object.keys(groupedData).map((merchantId) => (
          // <div className={cx("grid-container")}>
          <div key={merchantId}>
            <h2 className={cx("merchant-name-title")}>
              {groupedData[merchantId].merchant.name}
            </h2>
            <div className={cx("grid-container")}>
              {groupedData[merchantId].items.map((item, index) => (
                <div className={cx("box")} key={index}>
                  <div className={cx("titleBox")}>
                    <img src={logo} alt="logoMerchant" className={cx("logo")} />
                    <div className={cx("line")} />
                    <div className={cx("textTitle")}>
                      <p className={cx("nameMerchant")}>
                        {groupedData[merchantId].merchant.name}
                      </p>
                      <p className={cx("type")}>
                        {groupedData[merchantId].merchant.address}
                      </p>
                    </div>
                  </div>
                  <div className={cx("line-bottom")} />
                  <div className={cx("contentBox")}>
                    <div className={cx("content-food")}>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faBowlFood}
                          className={cx("icon")}
                        />
                        <p className={cx("textContent")}>{item.nameFood}</p>
                      </div>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faDollar}
                          className={cx("icon")}
                        />
                        <p className={cx("textContent")}>{item.price} đ</p>
                      </div>
                      <div className={cx("item")}>
                        <FontAwesomeIcon
                          icon={faUtensils}
                          className={cx("icon")}
                        />
                        <p className={cx("textContent")}>Cơm</p>
                      </div>
                    </div>
                    <div className={cx("line-content-food")} />
                    <div className={cx("image-food")}>
                      <img
                        src={item.image}
                        alt="food"
                        className={cx("food-request")}
                      ></img>
                    </div>
                  </div>
                  <div className={cx("line-bottom")} />
                  <div className={cx("btn-detail")}>
                    <Button detail onClick={() => handleDetailFood(item._id)}>
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          // </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Detail Food Request"
        className={cx("modal")}
      >
        {detailFood && (
          <div className={cx("modal-container")}>
            <div className={cx("logo-merchant")}>
              <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
              <img
                src={imageBackground}
                alt="Merchant"
                className={cx("img-merchant")}
              />
            </div>
            <div className={cx("content-modal")}>
              <Button awaiting>Awaiting Approve</Button>
              <div className={cx("container-content")}>
                <p className={cx("name-merchant")}>{name}</p>
                <div className={cx("line")}></div>
                <p className={cx("type-merchant")}>Đồ mặn</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Address:</p>
                <p className={cx("content-merchant")}>{address}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Price:</p>
                <p className={cx("content-merchant")}>{priceFood}</p>
              </div>
              <div className={cx("wrapper-content")}>
                <p className={cx("title-merchant")}>Name Food:</p>
                <p className={cx("content-merchant")}>{nameFood}</p>
              </div>

              <div className={cx("wrapper-image-content")}>
                <p className={cx("title-merchant")}>Image Food:</p>
                <p className={cx("content-merchant")}>
                  <img
                    src={imageFood}
                    alt="Document"
                    className={cx("image-document")}
                  />
                </p>
              </div>
              <div className={cx("btn-delete")}>
                <Button approve_btn onClick={() => handleApproval(id)}>
                  Approval
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FoodRequest;
