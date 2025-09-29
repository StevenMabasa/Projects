import java.util.Scanner;

public class project1 {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {   //not neccessary to wrap around the try class
            
            System.out.print("Principal ($1K - $1M): ");
            long amount = scanner.nextLong();

            while (amount<1000 || 1000000<amount) {
                System.out.println("Enter a number between 1,000 and 1,000,000");
                System.out.print("Principal ($1K - $1M): ");
                amount = scanner.nextLong();
            }

            System.out.print("Anual Interest Rate: ");
            double rate = scanner.nextDouble();

            while (rate<=0 || rate>30) {
                System.out.println("Enter a value greater than 0 and less than or equal to 30");
                System.out.print("Anual Interest Rate: ");
                rate = scanner.nextDouble();
            }

            System.out.print("Period (Years): ");
            long years = scanner.nextLong();

            while (years<1 || 30<years) {
                System.out.println("Enter a value between 1 and 30");
                System.out.print("Period (Years): ");
                years = scanner.nextLong();
            }

            rate = (rate/100) / 12;  //converting anual rate to monthly rate percentage
            years = years * 12;

            double numerator = rate * Math.pow(1+rate, years);
            double denominator = Math.pow(1+rate, years) - 1;

            double mortgage = amount * (numerator / denominator);

            System.out.print("Mortgage: $");
            System.out.println(Math.round(mortgage*100.0) / 100.0);
        }
    }
}
