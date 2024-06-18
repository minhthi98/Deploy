import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper as ProperWrapper } from "../../../Proper/index";
import AxiosInstance from "../../../../utils/AxiosInstance";
import Button from "../../../buttons/index";
import AccountItemMerchant from "../../../AccountItem/AccountMerchant/AccountCustomer/AccountMerchant";
import {
  faClock,
  faMagnifyingGlass,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./NewMerchant.module.scss";
import logo from "../../../../assets/images/logoYumhub.png";
import image_merchant from "../../../../assets/images/logo_merchant.png";
import ellipse from "../../../../assets/images/ellipse.png";

const cx = classNames.bind(styles);
function NewMerchant() {
  const [data, setData] = useState([]);
  const [selectMerchantById, setSelectMerchantId] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [tippyVisible, setTippyVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
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
  const [checkIDCard, setCheckIDCard] = useState(false);
  const [checkBusinessLicense, setCheckBusinessLicense] = useState(false);
  const [overAllIDCard, setOverAllIDCard] = useState();
  const [messageBusiness, setMessageBusiness] = useState();

  const selectDetail = async (id) => {
    try {
      setCheckIDCard(false);
      setCheckBusinessLicense(false);
      setOverAllIDCard(undefined);
      setMessageBusiness(undefined);
      setSearchResult([]);
      const response = await AxiosInstance.get(
        `merchants/getMerchantById/?id=${id}`
      );
      const { detailMerchant } = response.data;
      if (detailMerchant) {
        setSelectMerchantId(detailMerchant);
        setShowModal(true);
        console.log(document);
      } else {
        console.log("Không tìm thấy thông tin ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //load data hiển thị lên modal
  useEffect(() => {
    if (selectMerchantById) {
      setId(selectMerchantById._id || "");
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
      );
      setDocuments(filteredDocuments);
      setEmail(selectMerchantById.user ? selectMerchantById.user.email : "");
      setType(selectMerchantById.type ? selectMerchantById.type.name : ""); // show type
    }
  }, [selectMerchantById]);

  //list mercahnt
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "/merchants/listMerchantApproval"
        );
        setData(response.data.listMerchantApproval);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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
          "/merchants/findApproveMerchant",
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

  // xác nhận merchant
  const handleApproval = async (id) => {
    try {
      const response = await AxiosInstance.patch(
        `merchants/updateMerchant?id=${id}`,
        { status: 3 }
      );
      if (response.data.result === false) {
        setShowModal(false);
        Swal.fire({
          icon: "info",
          title: "Approval Failed",
          text: "There was an error updating the merchant!",
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Approval Successful",
          text: "The merchant has been successfully updated!",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //check giấy tờ căn cước
  const handleCheckIDCard = async (image) => {
    try {
      const response = await AxiosInstance.post(
        "merchants/checkIDCardDocument",
        { image }
      );
      setOverAllIDCard(response.data.data[0].overall_score);
      setCheckIDCard(true);
    } catch (error) {}
  };

  //check giấy phép kinh doanh
  const handleCheckBusinessLicense = async () => {
    try {
      setMessageBusiness("Cannot check business license");
      setCheckBusinessLicense(true);
    } catch (error) {}
  };

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
                      ? searchResult.map((merchant) => (
                          <AccountItemMerchant
                            key={merchant._id}
                            merchant={merchant}
                            handleView={selectDetail}
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
        <div className={cx("grid-container")}>
          {data.map((item) => (
            <div className={cx("box")} key={item._id}>
              <div className={cx("titleBox")}>
                <img src={logo} alt="logoMerchant" className={cx("logo")} />
                <div className={cx("line")} />
                <div className={cx("textTitle")}>
                  <p className={cx("nameMerchant")}>{item.name}</p>
                  <p className={cx("type")}>
                    {item.type ? item.type.name : "N/A"}
                  </p>
                </div>
              </div>
              <div className={cx("line-bottom")} />
              <div className={cx("contentBox")}>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faMap} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.address}</p>
                </div>
                <div className={cx("item")}>
                  <FontAwesomeIcon icon={faClock} className={cx("icon")} />
                  <p className={cx("textContent")}>{item.openTime}</p>
                </div>
              </div>
              <div className={cx("btn-detail")}>
                <Button
                  detail
                  onClick={() => {
                    selectDetail(item._id);
                  }}
                >
                  Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
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
            <div className={cx("content-modal")}>
              <Button awaiting>Awaiting Approve</Button>
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
                        {doc.documentTypeID.name}:
                      </p>
                      <div
                        className={cx("btn-check")}
                        onClick={() => handleCheckIDCard(doc.imageFontSide)}
                      >
                        <p className={cx("text-check")}>Check</p>
                      </div>
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
                      {checkIDCard ? (
                        <h2 className={cx("text-overAll-id-card")}>
                          OverAll:
                          <span
                            style={{
                              color: overAllIDCard < 80 ? "red" : "green",
                              marginLeft: "10px",
                            }}
                          >
                            {overAllIDCard}%
                          </span>
                        </h2>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                {licenseDriverDocuments.map((doc, index) => (
                  <div key={index} className={cx("wrapper-image-content")}>
                    <div className={cx("wrapper-title-document")}>
                      <p className={cx("title-merchant")}>
                        {doc.documentTypeID.name}:
                      </p>
                      <div
                        className={cx("btn-check")}
                        onClick={() =>
                          handleCheckBusinessLicense()
                        }
                      >
                        <p className={cx("text-check")}>Check</p>
                      </div>
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
                      {checkBusinessLicense ? (
                        <h2 className={cx("text-overAll-id-card")}>
                         {messageBusiness}
                          
                        </h2>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
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

export default NewMerchant;
