import ProfileForm from "../components/ProfileForm"
import BookingHistory from "../components/BookingHistory"

 function ProfilePage() {
  return (
    <div className="p-12 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold  mb-12">Personal Information</h2>
        <ProfileForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold  mb-12">Booking History</h2>
        <BookingHistory />
      </div>
    </div>
  )
}

export default ProfilePage

