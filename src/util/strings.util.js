const status = {
    insertDoc: { message: "document inserted successfully", code: 200 },
    updateDoc: { message: "document updated successfully", code: 200 },
    readDoc: { message: "document fetched successfully", code: 200 },
    deleteDoc: { message: "document deleted successfully", code: 200 },
    insertErrorDoc: { message: "document is not inserted", code: 503 },
    updateErrorDoc: { message: "document is not updated", code: 503 },
    readErrorDoc: { message: "document is not fetched", code: 503 },
    deleteErrorDoc: { message: "document is not deleted", code: 503 },
    noResult: { message: "No result found!", code: 404 },
    alreadyExists: { message: "document already exists!", code: 200 },
    doesntExists: { message: "document doesnt exists!", code: 502 },
    authError: { message: "Authorisation Error", code: 511 },
}

module.exports = { status }