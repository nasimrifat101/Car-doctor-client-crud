import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import BookingRow from "./BookingRow";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const axiosSecure = useAxiosSecure();
    const url = `/bookings?email=${user?.email}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosSecure.get(url);
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [url, axiosSecure]);

    const handleDelete = async (id) => {
        const proceed = window.confirm("Are you sure you want to delete?");
        if (proceed) {
            try {
                await axiosSecure.delete(`/bookings/${id}`);
                const remaining = bookings.filter((booking) => booking._id !== id);
                setBookings(remaining);
                alert("Deleted successfully");
            } catch (error) {
                console.error("Error deleting booking:", error);
            }
        }
    };

    const handleBookingConfirm = async (id) => {
        try {
            await axiosSecure.patch(`/bookings/${id}`, { status: "confirm" });
            const updatedBookings = bookings.map((booking) =>
                booking._id === id ? { ...booking, status: "confirm" } : booking
            );
            setBookings(updatedBookings);
        } catch (error) {
            console.error("Error confirming booking:", error);
        }
    };

    return (
        <div>
            <h2 className="text-5xl">Your bookings: {bookings.length}</h2>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    {/* Table header */}
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                        {bookings.map((booking) => (
                            <BookingRow
                                key={booking._id}
                                booking={booking}
                                handleDelete={handleDelete}
                                handleBookingConfirm={handleBookingConfirm}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bookings;
