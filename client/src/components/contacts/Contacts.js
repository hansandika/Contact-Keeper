import React, { useContext, useEffect, Fragment } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ContactContext from "../../context/contact/contactContext";
import ContactItem from "./ContactItem";
import Spinner from "../layout/Spinner";
import AuthContext from "../../context/auth/AuthContext";

const Contacts = () => {
	const contactContext = useContext(ContactContext);
	const authContext = useContext(AuthContext);

	const { contacts, filtered, getContacts, loading } = contactContext;
	const { user } = authContext;

	useEffect(() => {
		getContacts();
		// eslint-disable-next-line
	}, [user]);

	if (contacts?.length === 0) {
		return <h4>Please add a contact</h4>;
	}

	return (
		<Fragment>
			{contacts !== null && !loading ? (
				<TransitionGroup>
					{filtered !== null
						? filtered.map((contact) => {
								return (
									<CSSTransition
										key={contact._id}
										timeout={500}
										classNames="item"
									>
										<ContactItem contact={contact} />
									</CSSTransition>
								);
						  })
						: contacts.map((contact) => {
								return (
									<CSSTransition
										key={contact._id}
										timeout={500}
										classNames="item"
									>
										<ContactItem contact={contact} />
									</CSSTransition>
								);
						  })}
				</TransitionGroup>
			) : (
				<Spinner />
			)}
		</Fragment>
	);
};

export default Contacts;
