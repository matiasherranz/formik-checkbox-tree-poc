/* References:
 * Custom formik form fields: https://formik.org/docs/api/field#component
 * Formik form validation: https://formik.org/docs/guides/validation
 **/

import Head from 'next/head'
import { useState } from 'react'

import { Field, Form, Formik, FormikProps } from 'formik'

import CheckboxTree from 'react-checkbox-tree'
import styles from '../styles/Home.module.css'
import 'react-checkbox-tree/lib/react-checkbox-tree.css'

const nodes = [
  {
    value: 'countries',
    label: 'Countries',
    children: [
      {
        value: 'argentina',
        label: 'Argentina',
        children: [
          {
            value: 'buenos-aires',
            label: 'Buenos Aires',
          },
          {
            value: 'cordoba',
            label: 'Cordoba',
          },
        ],
      },
      {
        value: 'usa',
        label: 'United States',
        children: [
          {
            value: 'new-york',
            label: 'New York',
            children: [
              { value: 'manhattan', label: 'Manhattan' },
              {
                value: 'brooklyn',
                label: 'Brooklyn',
              },
            ],
          },
          {
            value: 'florida',
            label: 'Florida',
            children: [
              { value: 'miami', label: 'Miami' },
              {
                value: 'naples',
                label: 'Naples',
              },
            ],
          },
        ],
      },
    ],
  },
]

const CustomCBTComponent = ({
  field, // { name, value, onChange, onBlur }
  form, //: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { touched, errors } = form

  const [treeState, setTreeState] = useState<TreeState>({
    checked: [],
    expanded: [],
  })

  return (
    <div className={styles.cbtField}>
      <CheckboxTree
        icons={{
          check: '☑',
          uncheck: '☐',
          halfCheck: '√',
          expandOpen: '↓',
          expandClose: '→',
          expandAll: null,
          collapseAll: null,
          parentClose: null,
          parentOpen: null,
          leaf: null,
        }}
        nodes={nodes}
        checked={treeState.checked}
        expanded={treeState.expanded}
        onCheck={(checked) => {
          setTreeState((prevState) => ({
            ...prevState,
            checked,
          }))

          form.setValues((prevValues) => ({
            ...prevValues,
            checked,
          }))
        }}
        onExpand={(expanded) =>
          setTreeState((prevState) => ({ ...prevState, expanded }))
        }
        showNodeIcon={false}
      />
      {touched[field.name] && errors[field.name] && (
        <div className="error">{errors[field.name]}</div>
      )}

      <div className={styles.cbtField__values}>
        <h1 className="mt-4">Selected values:</h1>
        {JSON.stringify(treeState.checked, null, 2)}
        <h1 className="mt-4">Expanded values:</h1>
        {JSON.stringify(treeState.expanded, null, 2)}
        <h1 className="mt-4">Form values:</h1>
        {JSON.stringify(form.values, null, 2)}
      </div>
    </div>
  )
}

interface TreeState {
  checked: string[]
  expanded: string[]
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Formik + React Checkbox Tree integration POC</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Formik<a>+React Checkbox Tree</a>
        </h1>

        <Formik
          initialValues={{
            firstName: '',
          }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
            }, 1000)
          }}
        >
          {(props: FormikProps<any>) => (
            <Form className={styles.formikForm}>
              <h1 className="mt-4">Form:</h1>
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.fieldWidth}
              />

              <Field
                type="custom"
                name="cbtree"
                component={CustomCBTComponent}
                placeholder="Checkbox Tree"
              />

              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </main>
    </div>
  )
}
