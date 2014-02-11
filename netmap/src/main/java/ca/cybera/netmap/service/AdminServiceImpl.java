package ca.cybera.netmap.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

	@Value("${adminPassword}")
	private String adminPassword;
	
	@Override
	public void login(String password) throws Exception {

		System.err.println("Comparing " + adminPassword + " to " + password);
		
		if (!adminPassword.equals(password)) {
			throw new Exception("Invalid Password");
		}
		
	}

}
