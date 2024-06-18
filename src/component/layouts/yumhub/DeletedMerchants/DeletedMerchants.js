import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEye, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../buttons";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import classNames from "classnames/bind";
import styles from "./DeletedMerchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);

function DeletedMerchant() {
  const [data, setData] = useState([{}]);
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);
  const [selectMerchantById, setSelectMerchantId] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [documents, setDocuments] = useState([]);
  const [idCardDocuments, setIdCardDocuments] = useState([]);
  const [licenseDriverDocuments, setLicenseDriverDocuments] = useState([]);

  //gọi api allMerchant đã xóa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "merchants/getAllDeletedMerchant"
        );
        const merchants = response.data.merchants;
        setData(merchants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleView = async (id) => {
    setSearchResult([]);
    try {
      const response = await AxiosInstance.get(`merchants/getMerchantById?id=${id}`);
      const { detailMerchant } = response.data;
      console.log(response);
      if (detailMerchant) {
        console.log(detailMerchant);
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //load data lên màn hình modal
  useEffect(() => {
    if (selectMerchantById) {
      setName(selectMerchantById.name || "");
      setAddress(selectMerchantById.address || "");
      setCloseTime(selectMerchantById.closeTime || "");
      setOpenTime(selectMerchantById.openTime || "");
      setPhoneNumber(
        selectMerchantById.user ? selectMerchantById.user.phoneNumber : ""
      );
      setFullName(
        selectMerchantById.user ? selectMerchantById.user.fullName : ""
      );
      const filteredDocuments = selectMerchantById.document || [];
      setIdCardDocuments(
        filteredDocuments.filter((doc) => doc.documentTypeID.name === "ID Card")
      );
      setLicenseDriverDocuments(
        filteredDocuments.filter(
          (doc) => doc.documentTypeID.name === "Business License"
        )
      );;
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "N/A");
      setType(selectMerchantById.type ? selectMerchantById.type.name : "N/A");
    }
  }, [selectMerchantById]);

  // nhấn ra ngoài thanh search
  const handleClickOutSide = () => {
    setSearchResult([]);
  };

  // search
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    if (keyword) {
      try {
        const response = await AxiosInstance.post(
          "/merchants/findDeletedMerchant",
          {
            keyword,
          }
        );
        console.log(response);
        if (response.data.result && response.data.merchants.length > 0) {
          setSearchResult(response.data.merchants);
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

  const handleModalClose = () => {
    setShowModal(false);
  };
  return (
    <div className={cx("contaienr")}>
      <div className={cx("content")}>
        <p className={cx("title")}>All Deleted Merchant</p>
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
                      ? searchResult.map((merchant) => (
                          <AccountItemMerchant
                            key={merchant._id}
                            merchant={merchant}
                            // handleView={handleView}
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
        <div className={cx("box-container")}>
          <table className={cx("table")}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Time</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={cx("table-row")}
                  onClick={() => handleView(item._id)}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>{item.openTime}</td>
                  <td>
                    <img
                      src={logo}
                      alt={`${item.name} logo`}
                      className={cx("logo")}
                    />
                  </td>
                  <td>
                    <button
                      className={cx("action-button")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            isOpen={showModal}
            onRequestClose={handleModalClose}
            contentLabel="Update Merchant"
            className={cx("modal")}
          >
            {selectMerchantById && (
              <div className={cx("modal-container")}>
                <div className={cx("logo-merchant")}>
                  <img src={ellipse} alt="Ellipse" className={cx("ellipse")} />
                  <img
                    src={image_merchant}
                    alt="Merchant"
                    className={cx("img-merchant")}
                  />
                </div>
                <div className={cx("content")}>
                  <Button awaiting>Deleted</Button>
                  <div className={cx("container-content")}>
                    <p className={cx("name-merchant")}>{name}</p>
                    <div className={cx("line")}></div>
                    <p className={cx("type-merchant")}>{type}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Address:</p>
                    <p className={cx("content-merchant")}>{address}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Email:</p>
                    <p className={cx("content-merchant")}>{email}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Store Owner:</p>
                    <p className={cx("content-merchant")}>{fullName}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>PhoneNumber:</p>
                    <p className={cx("content-merchant")}>{phoneNumber}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Open Time:</p>
                    <p className={cx("content-merchant")}>{openTime}</p>
                  </div>
                  <div className={cx("wrapper-content")}>
                    <p className={cx("title-merchant")}>Close Time:</p>
                    <p className={cx("content-merchant")}>{closeTime}</p>
                  </div>
                  <div>
                  {idCardDocuments.map((doc, index) => (
                    <div key={index} className={cx("wrapper-image-content")}>
                      <div className={cx("wrapper-title-document")}>
                        <p className={cx("title-merchant")}>
                          {doc.documentTypeID.name}
                        </p>
                      
                      </div>
                      <div className={cx("wrapper-document")}>
                        <img
                          src={doc.imageFontSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                        <img
                          src={doc.imageBackSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        /> 
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {licenseDriverDocuments.map((doc, index) => (
                    <div key={index} className={cx("wrapper-image-content")}>
                      <div className={cx("wrapper-title-document")}>
                        <p className={cx("title-merchant")}>
                          {doc.documentTypeID.name}
                        </p>
                      </div>
                      <div className={cx("wrapper-document")}>
                        <img
                          src={doc.imageFontSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                        <img
                          src={doc.imageBackSide}
                          alt="Document Front Side"
                          className={cx("image-document")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DeletedMerchant;
