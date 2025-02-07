import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Accordion, Card } from 'react-native-paper'; // Assuming you have a library for Accordion and Card components in React Native
import VerticalStepCounter from '../../../../Common/VerticalSetpCounter';
import { networkInformation } from '../../../../services/MainService';
import DialogView from '../../../../Common/DialogView';
// import Steps from 'rc-steps';

const CPEInformation = ({ basicData, id, username }) => {
    const [expanded, setExpanded] = useState(false);
    const [showStepperListFromAddHardware, setShowStepperListFromAddHardware] = useState([]);
    const [availableHardware, setAvailableHardware] = useState({});
    const [parent, setParent] = useState([]);
    const [showText, setShowText] = useState(false);
    const [cpeText, setCpeText] = useState('CPE is not configured for this Customer');
    const [isDataLoading, setIsDataLoading] = useState(true);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        parentnas(basicData?.serial_no, 'parent_slno');
    }, [basicData?.serial_no]);

    useEffect(() => {
        let showStepperListNew = [];
        if (!!availableHardware && availableHardware.available_hardware) {
            const available_hardwareKeys = Object.keys(availableHardware.available_hardware);
            let available_hardwareKeysFinal = [];

            if (available_hardwareKeys.includes("parentnas_info")) {
                available_hardwareKeysFinal.push("parentnas_info");
            } else if (available_hardwareKeys.includes("nas_info")) {
                available_hardwareKeysFinal.push("nas_info");
            }
            if (available_hardwareKeys.includes("parentolt_info")) {
                available_hardwareKeysFinal.push("parentolt_info");
            } else if (available_hardwareKeys.includes("olt_info")) {
                available_hardwareKeysFinal.push("olt_info");
            }
            if (available_hardwareKeys.includes("parentdp2_info")) {
                available_hardwareKeysFinal.push("parentdp2_info");
            }
            if (available_hardwareKeys.includes("parentdp1_info")) {
                available_hardwareKeysFinal.push("parentdp1_info");
            }
            if (available_hardwareKeys.includes("childdp_info")) {
                available_hardwareKeysFinal.push("childdp_info");
            }
            
            const availableHardwareObject = {
                ...availableHardware.available_hardware,
            };

            showStepperListNew = available_hardwareKeysFinal.map((hardware) => {
                return {
                    title: availableHardwareObject[hardware].device_type,
                    name: availableHardwareObject[hardware].name,
                    total_ports: availableHardwareObject[hardware].total_ports,
                    available_ports: availableHardwareObject[hardware].available_ports,
                    zone: availableHardwareObject[hardware].zone,
                    connection_port: availableHardwareObject[hardware].connection_port,
                    branch: availableHardwareObject[hardware].branch,
                };
            });
        }
        setShowStepperListFromAddHardware(showStepperListNew);
        console.log("manipulated data",availableHardware, showStepperListNew);
    }, [availableHardware]);

    const parentnas = async (val, name) => {
        try {
            if (val) {
                setShowText(false);
                const response = await networkInformation(val);
                if(response.isSuccess) {
                    if (!Array.isArray(response?.result)) {
                        setParent([]);
                    }
    
                    let is_parent_oltport = null;
                    if (Array.isArray(response?.result) && name == "parent_slno") {
                        let parentSlNoList = [...response?.result];
                        let lastObj = parentSlNoList[parentSlNoList.length - 1];
                        let stepperList = [];
    
                        if (lastObj["category"] == "ChildDp") {
                            //search in parent sl no based in childdp entered
                            stepperList.push({
                                title: lastObj["parentnas"] != null ? lastObj["parentnas"] : "",
                            });
                            stepperList.push({
                                title: lastObj["parentolt"] != null ? lastObj["parentolt"] : "",
                            });
                            stepperList.push({
                                title:
                                    lastObj["parentdp1"] != null ? lastObj["parentdp1"] : "none",
                            });
                            stepperList.push({
                                title:
                                    lastObj["parentdp2"] != null ? lastObj["parentdp2"] : "none",
                            });
                            stepperList.push({
                                title:
                                    lastObj["device_name"] != null ? lastObj["device_name"] : "",
                            });
                        }
    
                        setAvailableHardware(lastObj);
                        setShowStepperListFromAddHardware(stepperList);
                        setIsDataLoading(false);
                        //end
    
                        if (parentSlNoList[parentSlNoList.length - 1].category == "Olt") {
                            is_parent_oltport = true;
                        } else if (
                            parentSlNoList[parentSlNoList.length - 1].category == "ParentDp"
                        ) {
                            is_parent_oltport = false;
                        }
                        if (Array.isArray(response?.result)) {
                            if (lastObj["usable"] == true) {
                                setParent(response?.result);
                            }
                        }
                    }
                    // else if (name = "parent_slno") {
                    //   let stepperList = [...showStepperListFromAddHardware]
                    //   stepperList[0].title = "";
                    //   stepperList[1].title = "";
                    //   stepperList[2].title = "";
                    //   stepperList[3].title = "";
                    //   stepperList[4].title = "";
                    //   setAvailableHardware({})
                    //   setShowStepperListFromAddHardware(stepperList);
    
                    // }
                }
                else {
                    setIsDataLoading(false);
                    setShowText(true);
                    setCpeText("Something went wrong, Please try again later!")
                }
            } else {
                setShowText(true);
                setIsDataLoading(false);
                setAvailableHardware({});
                setShowStepperListFromAddHardware([]);
            }
        } catch (error) {
            setIsDataLoading(false);
            console.log("something went wrong", error);
        }
        
    }
    ;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {isDataLoading && 
                <Text style={{padding: 20}}>
                    Fetching CPE information....
                </Text>
            }
            {!showText ?
            (<VerticalStepCounter steps={showStepperListFromAddHardware} currentStep={1} cpeText={cpeText}/>)
            :
            (<View style={{  flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View >
                    <Text style={{ color: 'black', fontSize: 20, padding: 20 }}>{cpeText}</Text>
                </View>
            </View>)}
        </View>
        
    );
};

export default CPEInformation;
