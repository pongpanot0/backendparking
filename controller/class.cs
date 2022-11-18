using System;
private static double loopGetLadderTimeRate(DataSet ds, int totalMinutes)
{
    double totPrice = 0.0;

    int totMinutes = totalMinutes;
    int totMinutesCal = totalMinutes;

    if (ds.Tables[0].Rows.Count != 0)
    {
        DataTable dt = ds.Tables[0];

        for (int i = 0; i <= dt.Rows.Count - 1; i++)
        {
            if (totMinutesCal <= 0)
            {
                break;
            }

            int hfrom = Convert.ToInt32(dt.Rows[i]["HFrom"].ToString());
            int mfrom = Convert.ToInt32(dt.Rows[i]["MFrom"].ToString());
            int sfrom = Convert.ToInt32(dt.Rows[i]["SFrom"].ToString());

            //string val = dt.Rows[i]["ValueCharge"].ToString();

            double chargeValue = Convert.ToDouble(dt.Rows[i]["ValueCharge"].ToString());

            bool isForwordRate = Convert.ToBoolean(dt.Rows[i]["IsForwordRate"].ToString());


            int totalMinTimeFrom = (hfrom * 60) + mfrom;

            if (isForwordRate == false)
            {
                int hto = Convert.ToInt32(dt.Rows[i]["Hto"].ToString());
                int mto = Convert.ToInt32(dt.Rows[i]["Mto"].ToString());
                int sto = Convert.ToInt32(dt.Rows[i]["Sto"].ToString());

                int totalMinTimeTo = (hto * 60) + mto;

                //if (totMinutes >= totalMinTimeFrom && totMinutes <= totalMinTimeTo)

                int diffMinutes = (totalMinTimeTo - totalMinTimeFrom);
                if ((hfrom + mfrom) == 0)
                {

                }
                else
                {
                    //totalMinTimeFrom -= 1; //ต้องการนาทีต้นด้วย
                    diffMinutes += 1;  //ต้องการนาทีต้นด้วย
                }

                if (totMinutes >= totalMinTimeFrom)
                {
                    //int totPeriod = (totalMinTimeTo - totalMinTimeFrom);
                    //totMinutesCal -= totPeriod;
                    totMinutesCal -= diffMinutes;
                    totPrice += chargeValue;
                }
            }
            else
            {
                string calRateBy = dt.Rows[i]["CalculateRateBy"].ToString();
                if (calRateBy == "H") //คิดเวลาเป็นต้นไปเป็นชั่วโมง
                {
                    int totHours = (totMinutesCal / 60);
                    int rest = (totMinutesCal % 60); // เอาเศษ
                    totPrice += (totHours * chargeValue);
                    if (rest > 0)
                    { // มีเศษเหลือชั่วโมง
                        totPrice += chargeValue;
                    }

                }
                else if (calRateBy == "M") //คิดเวลาเป็นต้นไปเป็นนาที
                {
                    totPrice += (totMinutesCal * chargeValue);
                }
            }
        }
    }
    return totPrice;
}