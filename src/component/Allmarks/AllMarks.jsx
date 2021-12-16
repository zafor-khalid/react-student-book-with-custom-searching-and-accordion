import React from 'react'

const AllMarks = ({ data }) => {
  return (
    <div
      style={{
        display: data?.grades.length > 0 ? 'block' : 'none',
        paddingLeft: '1.7rem',
        color: 'dimgray',
      }}
    >
      {' '}
      {data?.grades.map((grade, idx) => (
        <p key={idx}>
          Test{idx + 1 + ': '}
          {grade}
        </p>
      ))}
    </div>
  )
}

export default AllMarks
