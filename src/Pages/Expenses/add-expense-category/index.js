import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../../utils/config";
import { Multiselect } from "multiselect-react-dropdown";
import { ToastContainer, toast } from 'react-toastify';
import styles from "../expenses.module.css";
import Section from "@aio/components/Section";
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner'; 

export default function AddExpenseCategories() {
  const [expensesCategory, setExpenseNameCategory] = useState("");
  const [expensesCategoryDetail, setExpenseDetailCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();
 

  const addExpenseCategory = () => {
    if (expensesCategory.trim() === "" || expensesCategoryDetail.trim() === "") {
    //   alert("Please fill required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const parseToken = JSON.parse(token) || {};
    setIsLoading(true);
    
    const fetchData = async () => {
      const response = await fetch(`${API_BASE_URL}/expensecat/addexpensessCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parseToken}`,
        },
        body: JSON.stringify({ expensesCategory, expensesCategoryDetail }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Add successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        router.push("/expenses");
        setIsLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsLoading(false);
      }
    };
    fetchData();
  };

  return (
    <Section>
 {isLoading &&    <Spinner/>  }
    <div className="donarPage w-100">
               <ToastContainer position="top-right" autoClose={5000} />

      <div className="addDonarForm">
        <h2 className={`${styles.formHeaderext}`}>Enter Expense catgory</h2>
        <form>
        <div className="formMainDiv">

            <div className="label-form eventInp">
              <label htmlFor="expensesCategory">Expense Name Category</label>
              <br />
              <input
                type="text"
                id="expensesCategory"
                value={expensesCategory}
                onChange={(e) => setExpenseNameCategory(e.target.value)}
              />
            </div>
           
           
          <div className="label-form textAraeLabel">
              <label htmlFor="expensesCategoryDetail">Expense Detail Category</label>
              <br />
              <textarea
              className="textareaEvent"
                type="text"
                id="expensesCategoryDetail"
                value={expensesCategoryDetail}
                onChange={(e) => setExpenseDetailCategory(e.target.value)}
              />
            </div>
            </div>

        

          <div className="d-flex">
            <div className="submitEvent addDonarSubmitBtnMain">
              <button
                className="addDonarSubmitBtn"
                type="button"
                onClick={addExpenseCategory}
              >
                Submit
              </button>
            </div>
            <div className="nextDonarSubmitBtnMain"></div>
          </div>
        </form>
      </div>
    </div>
    </Section>

  );
}
