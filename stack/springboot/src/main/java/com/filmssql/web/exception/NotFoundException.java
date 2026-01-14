package com.filmssql.web.exception;

/**
 * Domain-specific 404 exception to surface missing resources.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}
