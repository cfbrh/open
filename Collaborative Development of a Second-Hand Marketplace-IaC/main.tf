resource "aws_instance" "demo" {
  ami           = "ami-079db87dc4c10ac91"  
  instance_type = "t2.micro"             

  tags = {
    Name = "Demo Instance"
  }
}

resource "aws_instance" "review_service" {
  ami                    = "ami-0df435f331839b2d6"
  instance_type          = "t2.micro"
  associate_public_ip_address = true 
  subnet_id              = "subnet-062de42603bf2b7bf"  
  vpc_security_group_ids = ["sg-0f8355afa47ddc362"]    

  tags = {
    Name = "Review Service"
  }
}

resource "aws_instance" "composition_service" {
  ami                    = "ami-0230bd60aa48260c6"
  instance_type          = "t2.micro"
  associate_public_ip_address = true
  subnet_id              = "subnet-062de42603bf2b7bf"  
  vpc_security_group_ids = ["sg-0f8355afa47ddc362"]    

  tags = {
    Name = "Composition Service"
  }
}

resource "aws_security_group" "launch-wizard-1" {
  name        = "launch-wizard-1"
  description = "Security group for launch wizard 1"
  vpc_id      = "vpc-0cb8e9f6312d308c1"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8011
    to_port     = 8011
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    ignore_changes = [
      description, # Ignore changes to the description field
    ]
  }
}
