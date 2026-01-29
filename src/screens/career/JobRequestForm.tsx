import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {JobRequest} from '../../core/model/jobRequest';
import FormFieldError from '../../components/FormFieldError';
import DatePicker from 'react-native-date-picker';
export {format, parseISO} from 'date-fns';
import {CustomFile} from '../about/AboutHomes';
import {useTranslation} from 'react-i18next';
import {jobRequestValidate} from '../../schema/jobRequest';
import {
  selectDropdownEnum,
  selectRadioEnum,
} from '../../sharedBase/dropdownUtils';
import {add as addData} from '../../core/service/subscribers.service';
import {CustomDropdown} from '../../components/CustomDropdown';
import {JobCategory} from '../../core/model/jobCategory';
import {JobVacancy} from '../../core/model/jobVacancy';
import {getAll} from '../../core/service/jobVacancies.service';
import FileUploadMain from '../../components/FileUploadMain';
import {parseISO, format} from 'date-fns';

function initialFormState(): JobRequest {
  return {
    id: undefined,
    name: '',
    firstName: '',
    lastName: '',
    mobile: '',
    emailId: '',
    dob: undefined,
    gender: '',
    qualification: '',
    curCtc: '',
    expCtc: '',
    noticePeriod: '',
    designation: '',
    experience: '',
    currentWorkLocation: '',
    preferredLocation: '',
    employmentType: '',
    jobCategoryId: '',
    jobCategoryIdName: '',
    applyingPost: '',
    skillSet: '',
    howDidKnow: '',
    didKnowNiran: '',
    ifYes: '',
    fileDoc: undefined,
    isAccept: false,
    createDate: undefined,
    updateDate: undefined,
    deleteDate: undefined,
    createById: undefined,
    updateById: undefined,
    deleteById: undefined,
    isDelete: false,
  };
}

export const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return '';
  const date =
    typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'MM-dd-yyyy');
};

function JobRequestForm({
  setRequestFormOpen,
}: {
  setRequestFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {t} = useTranslation();
  // const stepRefs = useRef<HTMLDivElement[]>([]);
  const [formData, setFormData] = useState<JobRequest>(initialFormState);
  const jobRequestSchema = jobRequestValidate(t);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobVacancylist, setJobVacancyList] = useState<JobVacancy[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [jobCategoryIdlist, setJobCategoryList] = useState<JobCategory[]>([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState<string | null>(
    null,
  );
  const [selectedJobVacancy, setSelectedJobVacancy] = useState<string | null>(
    null,
  );
  const [filteredJobVacancies, setFilteredJobVacancies] = useState<
    JobVacancy[]
  >([]);

  const [jobVacancys, setJobVacancys] = useState<JobVacancy>([]);
  const inputRefs = useRef<{name: string; required: boolean}[]>([]);

  console.log(errors, 'errors');

  const listGender = [
    {id: 1, value: 'Male'},
    {id: 2, value: 'Female'},
  ];

  const listMember = [
    {id: 1, value: 'Yes'},
    {id: 2, value: 'No'},
  ];

  const listEmployementType = [
    {id: 1, value: 'Fresher'},
    {id: 2, value: 'Experienced'},
  ];

  const listhowDidKnow = [
    {id: 1, value: 'Friend'},
    {id: 2, value: 'Relatives'},
    {id: 3, value: 'Social Media'},
    {id: 4, value: 'Colleague'},
    {id: 5, value: 'Job Portal(LinkedIn, Naukri)'},
    {id: 6, value: 'Employee Referral'},
  ];

  useEffect(() => {
    const fetchjob = async () => {
      const fetchjobData = await getAll();
      console.log(fetchjobData, 'fetchjob');
      setJobVacancys(fetchjobData);
    };
    fetchjob();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listJobCategory = jobVacancys;
        const options = listJobCategory.map((item: JobCategory) => ({
          ...item,
          id: item.id?.toString(),
        }));
        setJobCategoryList(options);
        if (formData?.jobCategoryId) {
          setSelectedJobCategory(formData.jobCategoryId);
        }

        const listJobVacancy = jobVacancys;
        const jobVacancyOptions = listJobVacancy.map((item: JobVacancy) => ({
          ...item,
          id: item.id?.toString(),
        }));
        setJobVacancyList(jobVacancyOptions);

        if (formData?.applyingPost) {
          setSelectedJobVacancy(formData.applyingPost);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [formData.applyingPost, formData.jobCategoryId, jobVacancys]);

  useEffect(() => {
    if (selectedJobCategory) {
      const filtered = jobVacancylist.filter(
        vacancy => vacancy.jobCategoryId?.toString() === selectedJobCategory,
      );
      setFilteredJobVacancies(filtered);
    } else {
      setFilteredJobVacancies(jobVacancylist);
    }
  }, [jobVacancylist, selectedJobCategory]);

  const removeEmptyFields = <T extends object>(obj: T): Partial<T> => {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key as keyof T];
      if (value !== '' && value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };

  const validateAllFields = () => {
    let hasError = false;
    const newErrors: Record<string, string> = {};

    // 1️⃣ Validate registered inputs
    inputRefs.current.forEach(({name, required}) => {
      const schema = jobRequestSchema[name as keyof typeof jobRequestSchema];
      const value = formData[name as keyof JobRequest];

      const isEmpty =
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0);

      // Required field
      if (required && isEmpty) {
        newErrors[name] = 'This field is required';
        hasError = true;
        return;
      }

      // Schema validation (only if value exists)
      if (schema && !isEmpty) {
        const result = schema.safeParse(value);
        if (!result.success) {
          newErrors[name] = result.error.errors[0]?.message ?? 'Invalid value';
          hasError = true;
          return;
        }
      }

      // Clear error if valid
      newErrors[name] = '';
    });

    // 2️⃣ Validate touched fields (live validation support)
    // Object.entries(touchedFields).forEach(([name, touched]) => {
    //   if (!touched) return;

    //   const schema = jobRequestSchema[name as keyof typeof jobRequestSchema];
    //   const value = formData[name as keyof JobRequest];

    //   const isEmpty = value === '' || value === null || value === undefined;

    //   if (!schema || isEmpty) {
    //     newErrors[name] = '';
    //     return;
    //   }

    //   const result = schema.safeParse(value);
    //   if (!result.success) {
    //     newErrors[name] = result.error.errors[0]?.message ?? 'Invalid value';
    //     hasError = true;
    //   } else {
    //     newErrors[name] = '';
    //   }
    // });

    // // 3️⃣ File upload validation
    // Object.entries(fileUploadValidation).forEach(([fieldName, validation]) => {
    //   if (!validation.isValid) {
    //     newErrors[fieldName] = validation.error || 'File validation failed';
    //     hasError = true;
    //   }
    // });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setShowErrors(true);
    setIsSubmitting(true);

    console.log('formData', formData);
    const isValid = validateAllFields();

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: JobRequest = {
        name: formData.firstName + ' ' + formData.lastName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        emailId: formData.emailId,
        dob: formData.dob,
        gender: formData.gender,
        qualification: formData.qualification,
        curCtc: formData.curCtc,
        expCtc: formData.expCtc,
        noticePeriod: formData.noticePeriod,
        designation: formData.designation,
        experience: formData.experience,
        currentWorkLocation: formData.currentWorkLocation,
        preferredLocation: formData.preferredLocation,
        employmentType: formData.employmentType,
        jobCategoryId: formData.jobCategoryId,
        jobCategoryIdName: formData.jobCategoryIdName,
        applyingPost: formData.applyingPost,
        skillSet: formData.skillSet,
        howDidKnow: formData.howDidKnow,
        didKnowNiran: formData.didKnowNiran,
        ifYes: formData.ifYes,
        // fileDoc: formData.fileDoc,
        isAccept: formData.isAccept,
      };

      if (formData.fileDoc) {
        payload.append('fileDoc', {
          uri: formData.fileDoc.uri,
          name: formData.fileDoc.name,
          type: formData.fileDoc.type,
        } as any);
      }

      console.log('payload', payload);
      const cleanedPayload = removeEmptyFields(payload);
      console.log('cleanedPayload', cleanedPayload);
      await addData(cleanedPayload);
      console.log('Your request has been submitted successfully');
      setFormData(initialFormState);
      setRequestFormOpen(false);
    } catch (error) {
      // if (process.env.NODE_ENV !== 'production') {
      //   console.error(error);
      // }
      console.error('Error submitting form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    const schema = jobRequestSchema[field as keyof typeof jobRequestSchema];

    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors(prev => ({...prev, [field]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message,
        }));
      }
    }
  };

  const handleDropdownChange = (value: string, controlName: string) => {
    const updatedFormData = selectDropdownEnum(
      {value, target: {name: controlName}},
      controlName,
      false,
      formData as Record<string, unknown>,
    );
    setFormData(updatedFormData as typeof formData);

    const schema =
      jobRequestSchema[controlName as keyof typeof jobRequestSchema];
    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors(prev => ({...prev, [controlName]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [controlName]: result.error.errors[0].message,
        }));
      }
    }
  };

  const handleCheckboxChange = (e: {checked?: boolean}, key: string) => {
    const value = e.checked ?? false;

    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));

    const schema = jobRequestSchema[key as keyof typeof jobRequestSchema];
    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors(prev => ({...prev, [key]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [key]: result.error.errors[0].message,
        }));
      }
    }
  };

  const handleRadioChange = (
    value: string,
    controlName: string,
    isBoolean = false,
  ) => {
    const updatedValue = selectRadioEnum(
      {value, target: {name: controlName}},
      controlName,
      formData as Record<string, unknown>,
      setFormData,
      isBoolean,
    );

    setFormData(prev => ({
      ...prev,
      [controlName]: updatedValue,
    }));

    const schema =
      jobRequestSchema[controlName as keyof typeof jobRequestSchema];
    if (schema) {
      const result = schema.safeParse(updatedValue);

      if (result.success) {
        setErrors(prev => ({...prev, [controlName]: ''}));
      } else {
        setErrors(prev => ({
          ...prev,
          [controlName]: result.error.errors[0].message,
        }));
      }
    }
  };

  const handleFileUpload = (newFiles: CustomFile[], inputName: string) => {
    if (!newFiles || !newFiles.length) return;

    setFormData(prev => ({
      ...prev,
      [inputName]: newFiles[0],
    }));

    setErrors(prev => ({
      ...prev,
      [inputName]: '',
    }));
  };

  const registerInput = (name: string, required = false) => {
    const exists = inputRefs.current.find(input => input.name === name);

    if (!exists) {
      inputRefs.current.push({name, required});
    }
  };

  return (
    <View style={styles.formContainer}>
      <View>
        <View style={styles.grid}>
          {/* firstName */}
          <View style={styles.field}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('firstName', true)}
              value={formData.firstName}
              onChangeText={text => handleInputChange('firstName', text)}
              placeholder="Enter your First Name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
              autoCapitalize="words"
            />
            <FormFieldError field="firstName" errors={errors} />
          </View>

          {/* lastname */}
          <View style={styles.field}>
            {/* Label */}
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>

            {/* Input */}
            <TextInput
              ref={ref => ref && registerInput('lastName', true)}
              value={formData.lastName}
              onChangeText={text => handleInputChange('lastName', text)}
              placeholder="Enter your Last Name"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
              autoCapitalize="words"
            />

            {/* Error */}
            <FormFieldError field="lastName" errors={errors} />
          </View>

          {/* email */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('emailId', true)}
              value={formData.emailId}
              onChangeText={text => handleInputChange('emailId', text)}
              placeholder="Enter a valid email address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              maxLength={100}
            />
            <FormFieldError field="emailId" errors={errors} />
          </View>

          {/* mobile */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              ref={ref => ref && registerInput('mobile', true)}
              value={formData.mobile}
              onChangeText={text =>
                handleInputChange('mobile', text.replace(/[^0-9]/g, ''))
              }
              placeholder="Enter your mobile"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              style={styles.input}
              maxLength={10}
            />
            <FormFieldError field="mobile" errors={errors} />
          </View>

          {/* dob */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>

            <TouchableOpacity
              style={[styles.input, showPicker && styles.focused]}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}>
              <Text style={formData.dob ? styles.text : styles.placeholder}>
                {formData.dob ? formatDate(formData.dob) : 'Pick a date'}
              </Text>
            </TouchableOpacity>

            <DatePicker
              ref={ref => ref && registerInput('dob', true)}
              modal
              open={showPicker}
              date={formData.dob ?? new Date(2000, 0, 1)}
              mode="date"
              maximumDate={new Date()}
              onConfirm={date => {
                setShowPicker(false);
                setFormData(prev => ({...prev, dob: date}));
              }}
              onCancel={() => setShowPicker(false)}
            />

            {/* Error */}
            <FormFieldError field="dob" errors={errors} />
          </View>

          {/* gender */}
          <View style={styles.field}>
            {/* Label */}
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>

            {/* Radio Group */}
            <View style={styles.radioGroup}>
              {listGender?.map((item: any) => {
                const selected = formData.gender === item.value;

                return (
                  <TouchableOpacity
                    ref={ref => ref && registerInput('gender', true)}
                    key={item.id}
                    style={styles.radioItem}
                    onPress={() => handleRadioChange(item.value, 'gender')}
                    activeOpacity={0.8}>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterActive,
                      ]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>

                    <Text style={styles.radioLabel}>{item.value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Error */}
            <FormFieldError field="gender" errors={errors} />
          </View>

          {/* qualification */}
          <View style={styles.field}>
            {/* Label */}
            <Text style={styles.label}>
              Qualification <Text style={styles.required}>*</Text>
            </Text>

            {/* Input */}
            <TextInput
              ref={ref => ref && registerInput('qualification', true)}
              value={formData.qualification}
              onChangeText={text => handleInputChange('qualification', text)}
              placeholder="Enter Higher Qualification"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
              autoCapitalize="words"
            />

            {/* Error */}
            <FormFieldError field="qualification" errors={errors} />
          </View>

          {/* ctc */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Current CTC <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('curCtc', true)}
              value={formData.curCtc}
              onChangeText={text =>
                handleInputChange('curCtc', text.replace(/[^0-9.]/g, ''))
              }
              placeholder="Enter Current CTC"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={styles.input}
              maxLength={100}
            />

            <FormFieldError field="curCtc" errors={errors} />
          </View>

          {/* expected ctc */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Expected CTC <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('expCtc', true)}
              value={formData.expCtc}
              onChangeText={text =>
                handleInputChange('expCtc', text.replace(/[^0-9.]/g, ''))
              }
              placeholder="Enter Expected CTC"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={styles.input}
              maxLength={100}
            />

            <FormFieldError field="expCtc" errors={errors} />
          </View>

          {/* notice period */}
          <View style={styles.field}>
            {/* Label */}
            <Text style={styles.label}>
              Notice Period <Text style={styles.required}>*</Text>
            </Text>

            {/* Input */}
            <TextInput
              ref={ref => ref && registerInput('noticePeriod', true)}
              value={formData.noticePeriod}
              onChangeText={text => handleInputChange('noticePeriod', text)}
              placeholder="Enter Notice Period"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
            />

            {/* Error */}
            <FormFieldError field="noticePeriod" errors={errors} />
          </View>

          {/* designation */}
          <View style={styles.field}>
            {/* Label */}
            <Text style={styles.label}>
              Current Designation <Text style={styles.required}>*</Text>
            </Text>

            {/* Input */}
            <TextInput
              ref={ref => ref && registerInput('designation', true)}
              value={formData.designation}
              onChangeText={text => handleInputChange('designation', text)}
              placeholder="Enter your current Designation"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
              autoCapitalize="words"
            />

            {/* Error */}
            <FormFieldError field="designation" errors={errors} />
          </View>

          {/* EXPERIENCE */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Total Experience
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('experience', true)}
              placeholder="Enter your total experience"
              value={formData.experience}
              onChangeText={text => handleInputChange('experience', text)}
              style={styles.input}
            />

            <FormFieldError field="experience" errors={errors} />
          </View>

          {/* CURRENT WORK LOCATION */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Current Work Location
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('currentWorkLocation', true)}
              placeholder="Enter your current work location"
              value={formData.currentWorkLocation}
              onChangeText={text =>
                handleInputChange('currentWorkLocation', text)
              }
              style={styles.input}
            />

            <FormFieldError field="currentWorkLocation" errors={errors} />
          </View>

          {/* PREFERRED LOCATION */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Preferred Location
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('preferredLocation', true)}
              placeholder="Enter Your Preferred Location"
              value={formData.preferredLocation}
              onChangeText={text =>
                handleInputChange('preferredLocation', text)
              }
              style={styles.input}
            />

            <FormFieldError field="preferredLocation" errors={errors} />
          </View>

          {/* EMPLOYMENT TYPE */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Type of Employment
              <Text style={styles.required}> *</Text>
            </Text>

            <View style={styles.radioGroup}>
              {listEmployementType?.map((item: any) => {
                const selected = formData.employmentType === item.value;

                return (
                  <TouchableOpacity
                    ref={ref => ref && registerInput('employmentType', true)}
                    key={item.id}
                    style={styles.radioRow}
                    onPress={() =>
                      handleRadioChange(item.value, 'employmentType')
                    }>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterActive,
                      ]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>

                    <Text style={styles.radioLabel}>{item.value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <FormFieldError field="employmentType" errors={errors} />
          </View>

          {/* job category */}
          <View style={styles.dropdownmain}>
            <Text style={styles.vlabel}>
              Job Category
              <Text style={styles.required}> *</Text>
            </Text>

            <CustomDropdown
              // ref={ref => ref && registerInput('jobCategoryId', true)}
              options={jobCategoryIdlist}
              selectedValue={selectedJobCategory}
              setSelectedValue={setSelectedJobCategory}
              onValueChange={val => handleDropdownChange(val, 'jobCategoryId')}
              placeholder="Select Job Category"
              controlName="jobCategoryId"
            />

            <FormFieldError field="jobCategoryId" errors={errors} />
          </View>

          {/* applying for the post  */}
          <View style={styles.dropdownmain}>
            <Text style={styles.vlabel}>
              Apply Post
              <Text style={styles.required}> *</Text>
            </Text>

            <CustomDropdown
              // ref={ref => ref && registerInput('applyingPost', true)}
              options={filteredJobVacancies}
              selectedValue={selectedJobVacancy}
              setSelectedValue={setSelectedJobVacancy}
              onValueChange={val => handleDropdownChange(val, 'applyingPost')}
              placeholder="Select Apply Post"
              controlName="applyingPost"
            />

            <FormFieldError field="applyingPost" errors={errors} />
          </View>

          {/* Skill set */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Skill Set
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              ref={ref => ref && registerInput('skillSet', true)}
              multiline
              numberOfLines={4}
              value={formData.skillSet}
              onChangeText={val => handleInputChange('skillSet', val)}
              placeholder="Enter Your skillset"
              maxLength={10000}
              style={styles.textarea}
            />

            <FormFieldError field="skillSet" errors={errors} />
          </View>

          {/* how did you come to know */}
          <View style={styles.field}>
            <Text style={styles.label}>
              How did you come to know about Niran?
              <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.radioGroup}>
              {listMember?.map((item: any) => (
                <TouchableOpacity
                  ref={ref => ref && registerInput('howDidKnow', true)}
                  key={item.id}
                  style={styles.radioItem}
                  onPress={() => handleRadioChange(item.value, 'howDidKnow')}>
                  <View style={styles.radioOuter}>
                    {formData.howDidKnow === item.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text style={styles.radioLabel}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FormFieldError field="howDidKnow" errors={errors} />
          </View>

          {/* Do you knoe */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Do you know anyone in Niran?
              <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.radioGroup}>
              {listhowDidKnow?.map((item: any) => (
                <TouchableOpacity
                  ref={ref => ref && registerInput('didKnowNiran', true)}
                  key={item.id}
                  style={styles.radioItem}
                  onPress={() => handleRadioChange(item.value, 'didKnowNiran')}>
                  <View style={styles.radioOuter}>
                    {formData.didKnowNiran === item.value && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text style={styles.radioLabel}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FormFieldError field="didKnowNiran" errors={errors} />
          </View>

          {/* if yes name */}
          <View style={styles.field}>
            <Text style={styles.label}>
              If Yes, Please specify Name of the person
            </Text>

            <TextInput
              value={formData.ifYes}
              onChangeText={text => handleInputChange('ifYes', text)}
              placeholder="Enter your reference name if any"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              maxLength={100}
            />

            <FormFieldError field="ifYes" errors={errors} />
          </View>

          {/* file upload */}
          <View style={styles.field}>
            <Text style={styles.label}>
              File Doc <Text style={styles.required}>*</Text>
            </Text>

            <Text style={styles.subLabel}>
              (Please upload a PDF file only.)
            </Text>

            <FileUploadMain
              modelName="JobRequest"
              propName="fileDoc"
              multiple={false}
              maxFileNumber={1}
              existingFiles={formData.fileDoc ? [formData.fileDoc] : []}
              error={errors.fileDoc}
              onFileUpload={files => {
                if (files?.length) {
                  handleFileUpload(files[0], 'fileDoc');
                }
              }}
              onValidationChange={(isValid, error) => {
                setErrors(prev => ({
                  ...prev,
                  fileDoc: isValid ? '' : error || 'Invalid file',
                }));
              }}
            />

            <Text style={styles.helperText}>Max File Size: 5 MB</Text>
          </View>

          {/* Terms and condition */}
          <View style={styles.field}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkboxOuter}
                onPress={() =>
                  handleCheckboxChange(
                    {checked: !formData.isAccept},
                    'isAccept',
                  )
                }>
                {formData.isAccept && <View style={styles.checkboxInner} />}
              </TouchableOpacity>

              <Text style={styles.checkboxLabel}>
                I accept the{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
              </Text>
            </View>
            {/* FOOTER (fixed) */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Apply Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setRequestFormOpen(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <FormFieldError field="isAccept" errors={errors} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default JobRequestForm;

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 8,
    gap: 24, // space-y-6
  },
  textarea: {
    minHeight: 100,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    backgroundColor: '#eaf4ff',
  },

  grid: {
    flexDirection: 'column',
    gap: 16, // gap-4
  },
  field: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937', // var(--color-dark)
    backgroundColor: '#e0f2fe', // var(--color-primary-light)
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  required: {
    color: '#1f2937',
  },
  readOnly: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  dropdownmain: {
    // flex: 1,
    marginBottom: 4,
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e3a8a', // var(--color-primary)
  },
  vlabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },

  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 2,
  },
  focused: {
    borderColor: '#2563eb',
    borderWidth: 2,
  },

  text: {
    fontSize: 14,
    color: '#1f2937',
  },

  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterActive: {
    borderColor: '#2563eb',
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },

  radioLabel: {
    fontSize: 14,
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  subLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  uploadText: {
    fontSize: 14,
    color: '#1e3a8a',
  },

  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  checkboxOuter: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#1e3a8a',
  },

  checkboxLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  linkText: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },

  primaryButton: {
    backgroundColor: '#005b83',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
