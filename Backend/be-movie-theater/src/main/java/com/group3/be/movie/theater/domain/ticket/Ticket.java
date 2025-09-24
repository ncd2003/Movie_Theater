package com.group3.be.movie.theater.domain.ticket;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MOVIETHEATER.TICKET")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TICKET_ID")
    private Long ticketId;

    @Column(name = "PRICE", precision = 19)
    private Long price;

    @Column(name = "TICKET_TYPE")
    private Integer ticketType;

    private Boolean active;
    @Column(name = "CREATE_AT")
    private Instant createdAt;
    @Column(name = "UPDATE_AT")
    private Instant updatedAt;
    @Column(name = "CREATE_BY")
    private String createdBy;
    @Column(name = "UPDATE_BY")
    private String updatedBy;
}
